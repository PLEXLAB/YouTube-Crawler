/* JavaScript file to handle the responsive navbar */

document.getElementById('collapsable-icon').addEventListener('click', ()=>{
    let x = document.getElementsByClassName('navbar-container');
    if (x[0].className === "navbar-container") {
        x[0].className += " responsive";
      } 
})


document.getElementById('close-icon').addEventListener('click', ()=>{
    let x = document.getElementsByClassName('navbar-container');
    if (x[0]. className === "navbar-container responsive"){
        x[0].className = "navbar-container";
    }
})