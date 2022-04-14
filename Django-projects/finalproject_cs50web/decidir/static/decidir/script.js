document.addEventListener('DOMContentLoaded',()=>{
  document.querySelector('#fullpage').style.display = 'none';
  let recipebtn = document.querySelector("#recipe-make");

  if (recipebtn)
  {
    let content = document.querySelector(".textarea");
    recipebtn.addEventListener('click',()=>
    {
      let foods = content.value.split('\n');
      let nutricion = {"calorias": 0, "carboidratos":0, "proteinas": 0, "gorduras":0};
      for(let food in foods)
      {
        fetch(`https://api.edamam.com/api/food-database/parser?app_id=6ae4d842&app_key=732ed701545b5a01933ff8cbc901b7ea&ingr=${foods[food]}`)
        .then(resp => resp.json())
        .then(resp => 
        {
          if (resp.hints.length)
          {

            nutricion.calorias += resp.hints[0].food.nutrients.ENERC_KCAL;
            nutricion.carboidratos += resp.hints[0].food.nutrients.CHOCDF;
            nutricion.proteinas +=  resp.hints[0].food.nutrients.PROCNT;
            nutricion.gorduras +=  resp.hints[0].food.nutrients.FAT;
            if((parseInt(food) + 1) == foods.length)
            {
              if(nutricion.calorias)
              {
                fetch('/receita', 
                {
                  method: 'POST',
                  body: JSON.stringify(
                  {
                    name : document.querySelector("#nome_receita").value,
                    img : document.querySelector("#img_receita").value,
                    modopreparo : document.querySelector("#modopreparo_receita").value,
                    calorias: nutricion.calorias,
                    carboidratos: nutricion.carboidratos,
                    proteinas: nutricion.proteinas,
                    gorduras: nutricion.gorduras,
                    foods: foods
                  })
                })
                .then(response => response.json())
                .then(result => 
                {
                  // Print result
                  console.log(result);
                  window.location.replace("/");
                });
              }
            }
          }
        });
      }
    });
  }
  btn_tradutor = document.getElementById('btn_traduzir');
  if(btn_tradutor)
  {
    btn_tradutor.addEventListener('click', ()=>
    {
      let content = document.querySelector(".textarea");
      fetch('/tradutor', 
      {
        method : 'POST',
        body: JSON.stringify(
        {
          traduzir: content.value
        })
      })
      .then(response => response.json())
      .then(result => 
      {
        // Print result
        content.value = result.traducao;
        //console.log(result.traducao);
      });
    });

  }
  likes = document.querySelectorAll('.like');
  if(likes)
  {
    likes.forEach(like =>{
          like.style.animationPlayState = 'running';
          like.addEventListener('click', () => 
          {
              like.style.animationName = 'hide';
              like.style.animationPlayState = 'running';
              fetch("/likes", {method: 'POST',
              body: JSON.stringify
              ({
                  id: like.dataset.receita_id
              })
              })
              .then(responsejson => responsejson.json())
              .then(response=> {
                  like.addEventListener('animationend', function animation() {
                      like.removeEventListener('animationend', animation);
                      let liked = document.getElementById('like'+response.receita_id);
                      liked.classList.toggle("fa-solid");
                      liked.classList.toggle("fa-regular");
                      liked.style.animationName = 'show';
                      liked.style.animationDuration = '1s';
                      liked.style.animationPlayState = 'running';
                      setTimeout(() => {location.reload(true)}, 500);
                  });
              });
          });
      })
  }
  cards_btn = document.querySelectorAll(".cards_btn");
  if(cards_btn)
  {
    cards_btn.forEach(card=>
      {
        card.addEventListener("click",()=>
        {
          let id = card.dataset.id_receita;
          fetch('/info/receita/'+id)
          .then(response => response.json())
          .then(receita => {
            // Print emails
            console.log(receita);
            fullpage(receita)
          });
        });
      });
  }


});

function fullpage(receita)
{
  document.querySelector('#receitas').style.display = 'none';
  let fullpage = document.querySelector('#fullpage');
  fullpage.style.display = 'block';
  let container_page = document.createElement('div');
  let ingredientes = document.createElement('section');
  let modopreparo = document.createElement('section');
  fullpage.appendChild(container_page);
  fullpage.appendChild(ingredientes);
  fullpage.appendChild(modopreparo);

  modopreparo.classList.add("container");
  ingredientes.classList.add("container");
  container_page.classList.add("container");
  container_page.innerHTML= "<div class='recipe-info text-center'><h3 class='title text-center color'>"+receita.name+"</h3><img class='img-full' src="+receita.img+"><div class='row row-full'><div class='col-sm-2 coluna-full'><p class='text-center color'>Calorias</p><p class='text-center'>"+Number((receita.calorias).toFixed(1))+"</p></div><div class='col-sm-2 coluna-full'><p class='text-center color'>Carboidratos</p><p class='text-center'>"+Number((receita.carboidratos).toFixed(1))+"g</p></div><div class='coluna-full col-sm-2'><p class='text-center color'>Proteinas</p><p class='text-center'>"+Number((receita.proteinas).toFixed(1))+"g</p></div><div class='coluna-full col-sm-2'><p class='text-center color'>Gorduras</p><p class='text-center'>"+Number((receita.gorduras).toFixed(1))+"g</p></div><div class='coluna-full col-sm-2'><p class='text-center color'><i  class='fa-solid fa-heart like color'></i></p><p class='text-center'>"+receita.likes+"</p></div></div></div>";
  ingredientes.innerHTML = "<div class='ingrdients-info text-center'><h3 class='title text-center color'>Ingredientes <i class='fa-solid fa-cart-shopping color'></i></h3><p class='text-center text'>"+receita.ingredientes+"</p></div>";
  modopreparo.innerHTML = "<div class='ingrdients-info text-center'><h3 class='title text-center color'>Modo de preparo<i class='fa-solid fa-kitchen-set'></i></h3><p class='text-center text'>"+receita.modoPreparo+"</p></div>";

}