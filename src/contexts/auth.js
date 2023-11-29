import { useState , createContext, useEffect} from 'react'
import { auth , db } from '../services/firebaseConnection'
import { createUserWithEmailAndPassword ,signInWithEmailAndPassword, signOut} from 'firebase/auth'
import { doc, getDoc, setDoc} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'



export const AuthContext = createContext({}); //objeto vazio

function AuthProvider({ children }){

     //informações do usuario
     const [ user, setUser ] = useState(null);
     const [loadingAuth , setLoadinAuth ] = useState(false);

     //controle de loading enquanto carrega a pagina
     const [ loading, seTLoading] = useState(true);

     const navigate = useNavigate();



     //função para permanecer logado
    useEffect(()=>{

    async function loadingUser(){

        const storageUser = localStorage.getItem('@chamadasPro')

        if(storageUser){
            setUser(JSON.parse(storageUser))
            seTLoading(false);
        }
        seTLoading(false);
    }
    loadingUser();

},[])




    //função de login
   async function signIn(email,password){
        setLoadinAuth(true);
        
        await signInWithEmailAndPassword(auth,email,password)
        .then(async (value)=>{
            let uid = value.user.uid;
           
            //buscando dados do usuario
            const docRef = doc(db, "users",uid);
            const docSnap = await getDoc(docRef)

            let data = {
                uid:uid,
                nome:docSnap.data().nome,
                email:value.user.email,
                avatarUrl:docSnap.data().avatarUrl

              

            }
            setUser(data);
            storageUser(data);
            setLoadinAuth(false);
            toast.success("Bem vindo de volta")
            navigate("/dashboard")


        })
        .catch((error)=>{
            console.log(error);
            setLoadinAuth(false);
            toast.error("Ops algo deu errado");

        })
    }     

    //cadastrar novo usuario : FIREBASE
    //criando pasta para usuario .
    async function signUp(email,password,name){
        setLoadinAuth(true);

        await createUserWithEmailAndPassword(auth, email,password)
        .then( async (value)=>{
            let uid = value.user.uid

            await setDoc(doc(db,"users",uid),{
                nome: name,
                avatarUrl: null


            })
            .then(()=>{

                 let data ={
                    uid:uid,
                    nome:name,
                    email:value.user.email,
                    avatarUrl:null
                    //criando dados para colocar dentro do user !!

                 };

                setUser(data);
                storageUser(data);
                setLoadinAuth(false);
                toast.success('Seja bem vindo ao sistema')
                navigate("/dashboard")

            })

        })
        .catch((error)=>{

            console.log(error);
            setLoadinAuth(false);
        })

    }

    function storageUser(data){
        localStorage.setItem('@chamadasPro',JSON.stringify(data))
    }


    //função deslogar usuario
    async function logout(){
        await signOut(auth);
        localStorage.removeItem('@chamadasPro');
        setUser(null);
    }
  


   

    return(
        <AuthContext.Provider
        value={{

             //verificar usuario logado ou nao .
            signed: !!user,
            user,
            signIn,
            signUp,
            logout,
            loadingAuth,
            loading,
            storageUser,
            setUser,
            

           

        }}
        >
         {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;

//todo Provider precisa passa um VALUE : ou seja ,o que eu quero que os outros componentes podem ter acesso.