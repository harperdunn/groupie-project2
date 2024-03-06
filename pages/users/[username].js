
import {useRouter} from "next/router"
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc} from 'firebase/firestore';
const { username } = router.query;
import {useParams} from "react-router-dom";


export default function Profile(){
  const {id}=useParams();
  console.log(id);
}