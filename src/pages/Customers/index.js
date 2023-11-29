import { useState} from 'react'
import Header from "../../components/Header";
import Title from '../../components/Title'
import { FiUser } from "react-icons/fi";
import {   db } from '../../services/firebaseConnection'
import { addDoc, collection } from 'firebase/firestore'
import { Toast, toast } from 'react-toastify';

export default function Customers(){

//dados da empresa
const [ nome, setNome ] = useState('');
const [ cnpj, setCnpj ] = useState('');
const [ endereco, setEndereco ] = useState('');

//criando banco de dados : FIREBASE
async function handleRegister(e){
    e.preventDefault();
 
    if(nome !== '' && cnpj !== '' && endereco !== ''){
        await addDoc(collection(db,"customers"),{
            nomeFantasia: nome,
            cnpj:cnpj,
            endereco:endereco


        })
        .then(()=>{
        setEndereco('')
        setCnpj('')
        setEndereco('')
        toast.success('Empresa registrada!')

        })
        .catch((error) => {   
            console.log(error)
            toast.error("Erro ao fazer o cadastro!")


        })
        


    }else{
        toast.error("Preencha todos os campos!")
    }

}


    return(
        <div>
            <Header/>

            <div className="content">
                <Title name="Clientes">
                 <FiUser size={25} />
                </Title>
                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Nome fantasia</label>
                        <input
                        type="text"
                        placeholder="Nome da empresa"
                        value={nome}
                        onChange={(e)=>{ setNome(e.target.value)
                            //pegar os dados que usuario digitar

                        }}
                        
                        />

                        <label>CNPJ</label>
                        <input
                        type="text"
                        placeholder="Digite o CNPJ"
                        value={cnpj}
                        onChange={(e)=>{ setCnpj(e.target.value)
                            //pegar os dados que usuario digitar

                        }}/>

                        <label>Endereço</label>
                        <input
                        type="text"
                        placeholder="Endereço da empresa"
                        value={endereco}
                        onChange={(e)=>{ setEndereco(e.target.value)
                            //pegar os dados que usuario digitar

                        }}
                        
                        />

                        <button type='submit'>
                            Salvar
                        </button>
                   </form>

                </div>

            </div>

        </div>
    )

}