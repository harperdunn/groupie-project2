import React from 'react';
import TopFive from '../../components/Profile/TopFive';
import Bio from '../../components/Profile/Bio'
import UserInfo from '../../components/Profile/UserInfo'
function Profile(){
    return(
        <div>
            <UserInfo></UserInfo>
            <TopFive></TopFive>
            <Bio></Bio>
        </div>
    )
}

export default Profile