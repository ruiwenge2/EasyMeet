var modal, content, okbtn, cancelbtn, input, value, func1;

function alertmodal(title, text, ok, focus) {	// alert box
	return new Promise(function(resolve, reject){
	    if(document.getElementsByClassName("modal-content").length > 0) modal.remove();
	    modal = document.createElement("div");
	    document.body.appendChild(modal);
	    modal.innerHTML = `
	      <div class = 'modal-content'>
	        <div class = 'container'>
	          <h1>${title}</h1>
	          <p style="font-size:16px">${text}</p>
	          <div class = 'clearfix'>
	            <button class = 'okbtn'>OK</button>
	          </div>
	        </div>
	      </div>
	    `;
	    modal.setAttribute("style", "position:fixed; z-index:100; left:0; top:0; width:100vw; height:100vh; padding-top:50px; background-color:rgba(0, 0, 0, 0.3);");
	    content = document.querySelector(".modal-content");
	    content.setAttribute("style", "background-color:#FFF; margin:5% auto 15% auto; border:2px solid blue; border-radius:5px; width:30%");
	    document.querySelector(".container").style.padding = '16px';
	    document.querySelector(".clearfix").style.textAlign = "right";
	    okbtn = document.querySelector(".okbtn");
	    if(ok !== undefined){
	      okbtn.innerHTML = ok;
	    }
	    okbtn.addEventListener("click", function(){
	      modal.remove();
	      resolve();
	    });
	    okbtn.setAttribute("style", "border:2px solid #0000FF; height:50px; outline:none; background-color:#0000FF; color:#FFF; border-radius:5px; width:125px; font-size:16px; user-select:none");
	    if(window.innerWidth <= 700) {
	      content.style.width = '60%';
	    }
	    else if(window.innerWidth > 700 && window.innerWidth <= 950) {
	      content.style.width = "50%";
	    }
	    okbtn.addEventListener("mouseover", function(){
	      okbtn.style.cursor = 'pointer';
	      okbtn.style.transition = 'all 0.3s ease-in-out';
	      okbtn.style.border = '2px solid #00008B';
	      okbtn.style.backgroundColor = '#00008B';
	    });
	    okbtn.addEventListener("mouseleave", function(){
	      okbtn.style.backgroundColor = '#0000FF';
	      okbtn.style.border = '2px solid #0000FF';
	    });
	    if(focus !== undefined) {
	      window.onclick = function(event){
	        if (event.target == modal) {
	            return cancelbtn.click();
	        }
	      };
	    }
	});
}

function confirmmodal(title, text, ok, focus) {		// confirm box
	return new Promise(function(resolve, reject){
	    if(document.getElementsByClassName("modal-content").length > 0) modal.remove();
	    modal = document.createElement("div");
	    document.body.appendChild(modal);
	    modal.innerHTML = `
	      <div class = 'modal-content'>
	        <div class = 'container'>
	          <h1>${title}</h1>
	          <p style="font-size:16px">${text}</p>
	          <div class = 'clearfix'>
	            <button class = 'cancelbtn'>Cancel</button>
	            <button class = 'okbtn'>OK</button>
	          </div>
	        </div>
	      </div>
	    `;
	    modal.setAttribute("style", "position:fixed; z-index:100; left:0; top:0; width:100vw; height:100vh; padding-top:50px; background-color:rgba(0, 0, 0, 0.3)");
	    content = document.querySelector(".modal-content");
	    content.setAttribute("style", "background-color:#FFF; margin:5% auto 15% auto; border:2px solid blue; border-radius:5px; width:30%");
	    document.querySelector(".container").style.padding = '16px';
	    document.querySelector(".clearfix").style.textAlign = "right";
	    cancelbtn = document.querySelector(".cancelbtn");
	    okbtn = document.querySelector(".okbtn");
	    if(ok !== undefined){
	      okbtn.innerHTML = ok;
	    }
	    cancelbtn.addEventListener("click", function(){
	      modal.remove();
	      reject();
	    });
	    okbtn.addEventListener("click", function(){
	      modal.remove();
	      resolve();
	    });
	    cancelbtn.setAttribute("style", "border:2px solid #0000FF; height:50px; outline:none; background-color:#FFF; color:#0000FF; border-radius:5px; width:125px; font-size:16px; user-select:none");
	    okbtn.setAttribute("style", "border:2px solid #0000FF; height:50px; outline:none; background-color:#0000FF; color:#FFF; border-radius:5px; width:125px; font-size:16px; user-select:none");
	    if(window.innerWidth <= 700) {
	      content.style.width = '60%';
	    }
	    else if(window.innerWidth > 700 && window.innerWidth <= 950) {
	      content.style.width = "50%";
	    }
	    cancelbtn.addEventListener("mouseover", function(){
	      cancelbtn.style.cursor = 'pointer';
	      cancelbtn.style.transition = 'all 0.3s ease-in-out';
	      cancelbtn.style.color = '#FFF';
	      cancelbtn.style.border = '2px solid #00008B';
	      cancelbtn.style.backgroundColor = '#00008B';
	    });
	    cancelbtn.addEventListener("mouseleave", function(){
	      cancelbtn.style.backgroundColor = '#FFF';
	      cancelbtn.style.border = '2px solid #0000FF';
	      cancelbtn.style.color = '#0000FF';
	    });
	    okbtn.addEventListener("mouseover", function(){
	      okbtn.style.cursor = 'pointer';
	      okbtn.style.transition = 'all 0.3s ease-in-out';
	      okbtn.style.border = '2px solid #00008B';
	      okbtn.style.backgroundColor = '#00008B';
	    });
	    okbtn.addEventListener("mouseleave", function(){
	      okbtn.style.backgroundColor = '#0000FF';
	      okbtn.style.border = '2px solid #0000FF';
	    });
	    if(focus !== undefined) {
	      window.onclick = function(event){
	        if (event.target == modal) {
	            return cancelbtn.click();
	        }
	      };
	    }
	});
}

function promptmodal(title, text, ok, focus, highlight, readonly){
	return new Promise(function(resolve, reject) {		// prompt box
	    if(document.getElementsByClassName("modal-content").length > 0) modal.remove();
	    modal = document.createElement("div");
	    document.body.appendChild(modal);
	    modal.innerHTML = `
	      <div class = 'modal-content'>
	        <div class = 'container'>
	          <h1>${title}</h1>
	          <p style="font-size:16px; margin:auto" id="p">${text}</p>
	          <br>
	          <input type = "text" class = "text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/>
	          <div class = 'clearfix'>
	            <button class = 'cancelbtn'>Cancel</button>
	            <button class = 'okbtn'>OK</button>
	          </div>
	        </div>
	      </div>
	    `;
	    modal.setAttribute("style", "position:fixed; z-index:100; left:0; top:0; width:100vw; height:100vh; padding-top:50px; background-color:rgba(0, 0, 0, 0.3);");
	    content = document.querySelector(".modal-content");
	    content.setAttribute("style", "background-color:#FFF; margin:5% auto 15% auto; border:2px solid blue; border-radius:5px; width:30%");
	    document.querySelector(".container").style.padding = '16px';
	    document.querySelector(".clearfix").style.textAlign = "right";
	    cancelbtn = document.querySelector(".cancelbtn");
	    okbtn = document.querySelector(".okbtn");
	    if(ok !== undefined){
	      okbtn.innerHTML = ok;
	    }
	    input = document.querySelector(".text");
	    input.focus();
	    if(highlight !== undefined && highlight !== false){
	      input.value = highlight;
	      input.select();
	    }
	    if(readonly !== undefined){
	      input.setAttribute("readonly", true);
	    }
	    input.setAttribute("style", "width: 90%; height: 30px; margin-bottom: 10px;font-size: 16px; outline: none; border: 1px solid #0000FF; border-radius: 2px; margin-left: 5%; margin-right:5%");
	    func = function(){
	      modal.remove();
	      reject();
	    }
	    cancelbtn.addEventListener("click", func);
	    okbtn.addEventListener("click", function(){
	      value = input.value;
	      modal.remove();
	      resolve(value);
	    });
	    cancelbtn.setAttribute("style", "border:2px solid #0000FF; height:50px; outline:none; background-color:#FFF; color:#0000FF; border-radius:5px; width:125px; font-size:16px; user-select:none");
	    okbtn.setAttribute("style", "border:2px solid #0000FF; height:50px; outline:none; background-color:#0000FF; color:#FFF; border-radius:5px; width:125px; font-size:16px; user-select:none");
	    if(window.innerWidth <= 700) {
	      content.style.width = '60%';
	    }
	    else if(window.innerWidth > 700 && window.innerWidth <= 950) {
	      content.style.width = "50%";
	    }
	    cancelbtn.addEventListener("mouseover", function(){
	      cancelbtn.style.cursor = 'pointer';
	      cancelbtn.style.transition = 'all 0.3s ease-in-out';
	      cancelbtn.style.color = '#FFF';
	      cancelbtn.style.border = '2px solid #00008B';
	      cancelbtn.style.backgroundColor = '#00008B';
	    });
	    cancelbtn.addEventListener("mouseleave", function(){
	      cancelbtn.style.backgroundColor = '#FFF';
	      cancelbtn.style.border = '2px solid #0000FF';
	      cancelbtn.style.color = '#0000FF';
	    });
	    okbtn.addEventListener("mouseover", function(){
	      okbtn.style.cursor = 'pointer';
	      okbtn.style.transition = 'all 0.3s ease-in-out';
	      okbtn.style.border = '2px solid #00008B';
	      okbtn.style.backgroundColor = '#00008B';
	    });
	    okbtn.addEventListener("mouseleave", function(){
	      okbtn.style.backgroundColor = '#0000FF';
	      okbtn.style.border = '2px solid #0000FF';
	    });
	    if(focus !== undefined && focus !== false) {
	      window.onclick = function(event){
	        if (event.target == modal) {
	          return cancelbtn.click();
	        }
	      };
	    }
	});
}