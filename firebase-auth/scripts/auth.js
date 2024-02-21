//signup
const signUpForm = document.querySelector('#signup-form') //query selector gets elements from the dom
//event is called submit
signUpForm.addEventListener('submit', (e) => {
    //prevent default refresh
    e.preventDefault();

    //get user info
    const email=signUpForm['signup-email'].value //finds input in the form for signup-email
    const password=signUpForm['signup-password'].value
    console.log(email,password)

    //sign up the user, the function occurs once signup is complete
    auth.createUserWithEmailAndPassword(email, password).then(cred =>{
        console.log(cred.user);  //writing the usesr credential token. stores the credentials in firebase project automatically
        const modal=document.querySelector('#modal-signup');,
        M.modal.getInstance(modal).close();
        signUpForm.reset();
})