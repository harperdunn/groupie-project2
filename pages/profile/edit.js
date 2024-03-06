import React from 'react';
import TopFive from '../../components/Profile/TopFive';
import Bio from '../../components/Profile/Bio'
import UserInfo from '../../components/Profile/UserInfo'
import Layout from '../../components/Layout';

function Profile() {
    return (
        <Layout>
            <div>
                <UserInfo />
                <TopFive />
                <Bio />
            </div>
        </Layout>
    );
}


export default Profile