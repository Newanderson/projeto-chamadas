
import { useState,useContext } from 'react';
import logo from '../../assets/logo.png'
import { Link } from'react-router-dom'
import { AuthContext } from '../../contexts/auth'



export default function SingUp(){
   //dados do usuario
    const [name, setName ] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword]= useState('');

    const {signUp , loadinAuth } = useContext(AuthContext);
    
    
   //cadastrar usuario
   async function handleSubmit(e){
        e.preventDefault();

    if( name !== '' && email !== '' && password !== ''){
        await signUp(email,password,name)

        }

    }
  


  


    return(
        <div className='container-center'>
         <div className='login'>
            <div className='login-area'>
                <img src={logo} alt='logo sistema chamada'/>

            </div>

            <form onSubmit={handleSubmit}>
                <h1>Nova conta</h1>
                <input type='text' placeholder='Seu nome'
                value={name}
                onChange={(e)=> setName(e.target.value)}
                />
                
                <input type='text' placeholder='exempo@gmail.com'
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                />

                <input type='password' 
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                />

               <button type='submit'>
                {loadinAuth ? 'Carregando...' : 'Cadastrar'} 
               </button>

             
            </form>
            <Link to="/"> Já possui uma conta? faça login </Link>

         </div>
        </div>
    )
}