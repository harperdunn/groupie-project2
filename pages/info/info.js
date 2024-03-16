import Layout from "../../components/Layout";
import "./info.css";

export default function info() {
    return (
        <Layout>
            <div className="info-page-container">
                <h1>Looking for more information?</h1>
                <h2>Here is an explanation of Groupie's features and how to use them!</h2>
                <div className="explanation-container">
                    <h2>Profile:</h2>
                    <p>Press the profile icon in the navigation bar to access your personal profile. Customize this page to display your favorite picture of yourself, a little blurb about you, and your top five musical artists of all time! 
                        Once you start posting concert reviews, they will appear on this page too! Edit your pofile any time by simply clicking the edit button 
                        at the bottom of the page.
                    </p>
                    <h2>Bucket List:</h2>
                    <p>Are there any artists that you are dying to see in concert? Add them to your bucket list and cross them off when your dreams come true! You
                        can optionally include an image of that artist or their album art as well. Access your bucket list any time by clicking the list icon in the
                        navigation bar.
                    </p>
                    <h2>Liked Posts:</h2>
                    <p>When you see a review that you enjoy, give it a like! It will be stored on your liked posts page and you can return to it any time by clicking 
                        the heart icon in the navigation bar. To remove a review from your liked posts page, simply navigate to that post and unlike it.
                    </p>
                    <h2>Create New Post:</h2>
                    <p>Press the add icon in the navigation bar to create a new post. Here you can write a diary entry about a concert you have attended. Include the 
                        name of the musical artist, the date of the event, the venue where it took place, a photo, a rating out of five stars, a review or caption, the set list, and some genre tags.
                        Soon you will have a full log of all your favorite live music memories!
                    </p>
                    <h2>Search:</h2>
                    <p>Want to see what other people are up to, discover new artists in a genre you like, or decide if you should really drop a couple hundred dollars on a
                        a certain performer? Click the magnifying glass icon in the navigation bar to search through other users' posts. Simply type a search term into the
                        search bar to view any posts containing that term, or narrow your search using filters. You can search by an artist to see what people think of their 
                        live performances, by a venue to see what types of artists play at your local digs, by a genre to find new artists you might like, or by a user to return
                        to the posts of your favorite groupie!
                    </p>
                    <h2>Discover:</h2>
                    <p>Feeling uninspired? Want to discover something new? Click the globe icon in the navigation bar to view nine randomized posts. Generate nine new posts any time
                        by pressing the refresh button at the bottom of the page.
                    </p>
                    <h2>View Post:</h2>
                    <p>View individual posts by clicking the post thumbnails that appear on Profile, Liked Posts, Search, and Discover. Here you can find the details of a users'
                        concert going experience. Like other users' posts by clicking the empty heart icon that appears next to the artist's name. Unlike a post by clicking the full heart icon
                        that takes its place. If you dislike one of your posts and would like to get rid of it for good, press the trash can icon that appears next to the artist's name. Note 
                        that users can only delete their own posts and can only like other users' posts.
                    </p>
                    <h2>Help:</h2>
                    <p>Well, here you are! If you ever get confused about Groupie's functionality, press the question mark icon in the navigation bar to return to this page. Here
                        you will find all the information you need in order to be a successful groupie!
                    </p>
                    <h2>Sign Out:</h2>
                    <p>It's as simple as that! Sign out of your account any time by pressing the sign out button at the bottom of the navigation bar. Hopefully we will see you again
                        soon!
                    </p>
                </div>
            </div>
        </Layout>
    );
}