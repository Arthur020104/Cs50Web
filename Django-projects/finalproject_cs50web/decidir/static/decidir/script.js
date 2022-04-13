document.addEventListener('DOMContentLoaded',()=>{





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
            /*if("sweet potato" in foods)
            {
              sweet problem
            }*/
            nutricion.calorias += resp.hints[0].food.nutrients.ENERC_KCAL;
            nutricion.carboidratos += resp.hints[0].food.nutrients.CHOCDF;
            nutricion.proteinas +=  resp.hints[0].food.nutrients.PROCNT;
            nutricion.gorduras +=  resp.hints[0].food.nutrients.FAT;
            if((parseInt(food) + 1) == foods.length)
            {
              if(nutricion.calorias)
              {
                /*
                console.log(nutricion);
                console.log(nutricion.calorias);
                console.log(nutricion.proteinas);
                console.log(nutricion.gorduras);
                console.log("carbo:"+nutricion.carboidratos);
                */
                fetch('/receita', 
                {
                  method: 'POST',
                  body: JSON.stringify(
                  {
                    name : document.querySelector("#nome_receita").value,
                    img : document.querySelector("#img_receita").value,
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



});