import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from 'react-icons/fi'
import { useContext , useEffect, useState } from 'react'
import {AuthContext} from '../../contexts/auth'
import { Link } from 'react-router-dom'
import { collection, getDocs, orderBy, limit, startAfter, query} from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import { format} from 'date-fns'
import Modal from '../../components/Modal'

import './dashboard.css'

const listRef = collection(db, "chamados")

export default function Dashboard(){
  const { logout } = useContext(AuthContext);

  const [chamados, setChamados] = useState([])
  //
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false)//lista vazia


  //aramazena ultimo item da lista , para poder buscar mais .
  const [lastDocs, setLastDocs] = useState()
  const [ loadingMore, setLoadingMore] = useState(false)//loading de carregamento.

  //modal
  const [modal, setModal] = useState(false);

  //detalhes do item Modal
  const [detail, setDetail] = useState()


 
//buscando os chamados , rederizar na tela 
  useEffect(() => {
    async function loadChamados(){
      const q = query(listRef, orderBy('created', 'desc'), limit(5));

      const querySnapshot = await getDocs(q)
      setChamados([]);

      await updateState(querySnapshot)

      setLoading(false);

    }

    loadChamados();


    return () => { }
  }, [])


  async function updateState(querySnapshot){
    const isCollectionEmpty = querySnapshot.size === 0;

    if(!isCollectionEmpty){
      let lista = [];

      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento,
        })
      })
     
      //pegando o ultimo item 
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1 ]
     

      setChamados(chamados => [...chamados, ...lista])
      setLastDocs(lastDoc);



    }else{
      setIsEmpty(true);
    }

    setLoadingMore(false);
    


  }

  //bucar mais chamados apartir do ultimo.
 async function handleMore(){
    setLoadingMore(true);

    const q = query(listRef, orderBy('created', 'desc'),startAfter(lastDocs), limit(5));

    const querySnapshot = await getDocs(q);
    await updateState(querySnapshot);



  }


 //botão search
 function showmodal(item){
  setModal(!modal)
  setDetail(item)

 }



 //renderizando : enquanto carrega mostra "buscando chamados"
  if(loading){
    return(
      <div>
        <Header/>

        <div className="content">
          <Title name="Tickets">
            <FiMessageSquare size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>
        </div>
      </div>
    )
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Tickets">
          <FiMessageSquare size={25} />
        </Title>

        <>
          {
          
          //  quando nao tiver cliente : mostra apneas botão e a mensagem 

          chamados.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhum chamado encontrado...</span>
              <Link to="/new" className="new">
                <FiPlus color="#FFF" size={25} />
                Novo chamado
              </Link>  
            </div>
          ) : (
            <>
              <Link to="/new" className="new">
                <FiPlus color="#FFF" size={25} />
                Novo chamado
              </Link>  

              <table>
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status</th>
                    <th scope="col">Cadastrando em</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.map((item, index) => {
                    return(
                      <tr key={index}>
                        <td data-label="Cliente">{item.cliente}</td>
                        <td data-label="Assunto">{item.assunto}</td>
                        <td data-label="Status">
                          <span className="badge" style={{ backgroundColor : item.status === 'Aberto' ?
                          '#5cb85c' : '#999'}}>
                            {item.status}
                          </span>
                        </td>
                        <td data-label="Cadastrado">{item.createdFormat}</td>
                        <td data-label="#">
                          <button className="action" style={{ backgroundColor: '#3583f6' }}  onClick={() => showmodal(item)}>
                            <FiSearch color='#FFF' size={17}/>
                          </button>
                         
                          <Link to={`/new/${item.id}`} 
                          //abrindo pagina buscando o id /pagina new
                          className="action" style={{ backgroundColor: '#f6a935' }}>
                            <FiEdit2 color='#FFF' size={17}/>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table> 

                  

              { loadingMore && <h3 className='buscar'>Buscando mais chamados...</h3>}

              {!loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore}>Buscar mais </button>   }     
            </>
          )}
        </>

      </div>

      {modal && (
        <Modal

        conteudo={detail}
        close={()=> setModal(!modal)}
        
        />
      )}
    
    </div>
  )
}

