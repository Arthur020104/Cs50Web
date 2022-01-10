if (!localStorage.getItem('counter')){
    localStorage.setItem('counter', 0);
}
function count()
{
    let counter = localStorage.getItem('counter');
    counter++;
    document.querySelector('h1').innerHTML = `Counter: ${counter}`;
    localStorage.setItem('counter', counter);
    /*if(counter % 10 === 0)
    {
        alert(`Count is now ${counter}`)
    }*/
}
document.addEventListener("DOMContentLoaded", function(){
    document.querySelector('h1').innerHTML = `Counter: ${localStorage.getItem('counter')}`;
    document.querySelector('button').addEventListener('click', count);

    setInterval(count, 1000);
});