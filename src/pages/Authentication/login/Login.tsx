import { useState } from 'react';
import { toast } from 'react-toastify';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Loader from '../../../component/loader/Loader';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

//   const signin = async () => {
//     setLoading(true);
//     try {
//       // Firestore se Admins collection se data lena
//       const q = query(collection(fireDB, 'Admins'), where('email', '==', email), where('password', '==', password));
//       const querySnapshot = await getDocs(q);

//       if (querySnapshot.empty) {
//         toast.error('Invalid email or password', {
//           position: 'top-right',
//           autoClose: 5000,
//           hideProgressBar: true,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: 'colored',
//         });
//       } else {
//         // Login successful, user data ko console mein log karna
//         querySnapshot.forEach((doc) => {
//           console.log('User Data:', doc.data());
//         });

//         toast.success('Signin Successfully', {
//           position: 'top-right',
//           autoClose: 2000,
//           hideProgressBar: true,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: 'colored',
//         });

//         window.location.href = '/';
//       }
//     } catch (error) {
//       toast.error('Signin Failed', {
//         position: 'top-right',
//         autoClose: 5000,
//         hideProgressBar: true,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: 'colored',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
   
const signin = async () => {
    setLoading(true);
    try {
      // Firestore se Admins collection se data lena
      const q = query(collection(fireDB, 'Admins'), where('email', '==', email), where('password', '==', password));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        toast.error('Invalid email or password', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } else {
        // Login successful, user data ko console mein log karna
        querySnapshot.forEach((doc) => {
          // console.log('User Data:', doc.data());
          // Storing current user data in localStorage
          localStorage.setItem('currentUser', JSON.stringify(doc.data()));
        });
  
        toast.success('Signin Successfully', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
  
        window.location.href = '/';
      }
    } catch (error) {
      toast.error('Signin Failed', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className='flex justify-center items-center h-screen'>
      {loading && <Loader />}
      <div className='bg-gray-800 px-10 py-10 rounded-xl'>
        <div>
          <h1 className='text-center text-white text-xl mb-4 font-bold'>Login</h1>
        </div>
        <div>
          <input
            type='email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
            placeholder='Email'
          />
        </div>
        <div>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
            placeholder='Password'
          />
        </div>
        <div className='flex justify-center mb-3'>
          <button onClick={signin} className='bg-yellow-500 w-full text-black font-bold px-2 py-2 rounded-lg'>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
