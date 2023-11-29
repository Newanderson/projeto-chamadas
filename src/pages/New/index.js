import { useState, useEffect, useContext } from "react";
import Header from "../../components/Header"
import Title  from "../../components/Title"
import "./new.css";
import {FiPlusCircle} from "react-icons/fi"
import { AuthContext} from '../../contexts/auth'
import { db } from '../../services/firebaseConnection'
import { collection , getDocs , getDoc, doc, onSnapshot, addDoc, updateDoc} from 'firebase/firestore'

import { toast } from 'react-toastify'
import {  useParams, useNavigate} from 'react-router-dom'
// useParams : rook para poder pegar o item na tela no caso o ID do usuario.


const listRef = collection(db,"customers");



export default function New(){



    //saber quem estar logado 
    const { user } = useContext(AuthContext);

    //buscar ID do usuario
    const { id } = useParams();
    const navigate = useNavigate();



    const [loadCustomers, setLoadCustomers] = useState(true);

    //dodos da lista de clientes
    const [customers,setCustomers] = useState([])

    //dados do complemento
    const [complemento, setComplemento] = useState('');//textarea
    const [customersSelected, setCustomersSelected] = useState(0)

    const [assunto, setAssunto] = useState('Suporte');//assunto
    const [status, setStatus] = useState('Aberto');

   


    //estado botao Registar para quando : adicionar ou atualizar
    const [idCustomres, setIdCustomers] = useState(false)




//buscando clientes no firebase
 useEffect(()=>{


      async function loadCustomers(){
        const querySnapshot = await getDocs(listRef)

        .then((snapshot)=>{

            //passando dados para uma lista
            let lista = [];

            snapshot.forEach((doc)=>{
                lista.push({
                    id: doc.id,
                    nomeFantasia: doc.data().nomeFantasia
                })

            })
            //verificação se tem cliente
            if(snapshot.docs.size === 0){
                console.log("NENHUMA EMPRESA ENCONTRADA");
                setCustomers([{ id: '1', nomeFantasia: 'FRELLA'}])
                setLoadCustomers(false)
                return;

            }

            setCustomers(lista);
            setLoadCustomers(false);

            //chamando dados do cliente
            //se tiver um ID executar a função
            if(id){
                loadId(lista);
            }
            
        })
        .catch((error)=>{
            console.log("ERRO A BUSCAR CLIENTE",error)
            setCustomers(false);
            setCustomers([{ id: '1' , nomeFantasia: 'FRELLA'}])

        })

    }
    loadCustomers();

 }, [id])

 //buscando chamados do ID

    //função buscar chamados do ID
    async function loadId(lista){
        const docRef = doc(db,"chamados",id);

        await getDoc(docRef)
        .then((snapshot)=>{
            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setComplemento(snapshot.data().complemento);


            //selecionar automatico o cliente 
            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
            setCustomersSelected(index);
           setIdCustomers(true);

        })
        .catch((error)=>{
            console.log(error);
            setIdCustomers(false);
        })
        
        


    }


    //função de status de check
    function handleOptionChange(e){
        setStatus(e.target.value);
    
    }

    //função input de assunto : select
    function hanleChangeSelect(e){
        setAssunto(e.target.value)

    }


    //função select : escolher clinete
    function handleChangeCustomers(e){
        setCustomersSelected(e.target.value)
        console.log(customers[e.target.value].nomeFantasia);

    }

    //função registro
    async function handreRegister(e){
        e.preventDefault();

        if(idCustomres){
            //atualizando chamado
            //so vai atualizar se ouver um ID :Url, caso contario vai adicionar.

            const docRef = doc(db,"chamados", id)
            await updateDoc(docRef,{

            cliente: customers[customersSelected].nomeFantasia,
            clienteId: customers[customersSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid,

            })
            .then(()=>{
                toast.success("Chamado Atualizado")
                setIdCustomers(0);
                setComplemento('');
                navigate("/dashboard")
                
               })
               .catch((error)=>{
                   console.log(error);
                   toast.error("Erro ao Atualizar")
       
               })





            return;
        }


        //registrar chamado
        await addDoc(collection(db, "chamados"),{
            created : new Date(),
            cliente: customers[customersSelected].nomeFantasia,
            clienteId: customers[customersSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid,


        })
        .then(()=>{
         toast.success("Chamado registrado")
         setComplemento('')
         setCustomersSelected(0)
        })
        .catch((error)=>{
            console.log(error);
            toast.error("Erro ao cadastrar")

        })

    }


    return(
        <div>
            <Header/>

            <div className="content">
                <Title name={id ? "Editando Chamado" : "Novo Chamado"}>
                   <FiPlusCircle size={25}/>
                 </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handreRegister}>

                        <label>Clientes</label>

                        {loadCustomers ? (
                            <input type="text" disabled={true} value="Carregando..."/>
                        ) : (
                            <select value={customersSelected} 
                            onChange={handleChangeCustomers}>
                                {customers.map((item,index)=>{
                                    return(
                            <option key={index} value={index}>
                                            {item.nomeFantasia}

                                        </option>
                                    )

                                })}

                            </select>
                        )
                    }

                        <label>Assunto</label>
                        <select value={assunto} onChange={hanleChangeSelect}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Tecnica</option>
                            <option value="Financeiro">Financeiro</option>

                        </select>

                        <label className="radio ">Status</label>
                        <div className="status">

                            <input
                            type="radio"
                            name="radio"
                            value="Aberto"
                            onChange={handleOptionChange}
                            checked={ status === "Aberto"}
                            />
                            <span>Em aberto</span>

                            
                            <input
                            type="radio"
                            name="radio"
                            value="Progresso"
                            onChange={handleOptionChange}
                            checked={ status === "Progresso"}
                            />
                            <span>Progresso</span>


                            <input
                            type="radio"
                            name="radio"
                            value="Atendido"
                            onChange={handleOptionChange}
                            checked={ status === "Atendido"}
                            />
                            <span>Atendido</span>
                            
                            
                        </div>
                        <label>Complemento</label>
                        <textarea
                        type="text"
                        placeholder="Descreva seu problema(opcional)"
                        value={complemento}
                        onChange={ (e)=> setComplemento(e.target.value)}
                        
                        
                        />

                        <button type="submit" >Registrar</button>

                        

                    </form>

                </div>

            </div>

        </div>

    )
}


