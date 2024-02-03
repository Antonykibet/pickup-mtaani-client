function generateRandomNumb() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function generateSiteId(){
    let domainName=window.location.hostname
    return `${domainName}:${generateRandomNumb()}`
}
function getSiteId(){
    let siteId = localStorage.getItem('siteId')
    if(!siteId){
        localStorage.setItem('siteId',generateSiteId())
        return localStorage.getItem('siteId')
    }
    return siteId
}
async function getAgents(){
    let response = await fetch(`https://bralessnation.com/api/agents?siteId=${getSiteId()}`)
    return await response.json()
}
async function getSiteConfig(){
    let response = await fetch(`https://bralessnation.com/api/getConfig?siteId=${getSiteId()}`)
    return await response.json()
}
async function getPickupMtaaniCost(isOn,price){
    if(!isOn){
        price=0
    }
    return price
}


function agentOptionsRender(div,agents){
    div.innerHTML=''
    agents.forEach((item) => {
        let agentDiv = document.createElement('div');
        agentDiv.style.cssText = 'display:flex;flex-direction:column;'
        labelElementCreator(agentDiv,item)
        div.append(agentDiv);
    });
}
function labelElementCreator(div,item){
    let labelDropdown = document.createElement('div');
    labelDropdown.classList.add('labelDropdown')
    labelDropdown.setAttribute('id',`${item.location}`)
    labelDropdown.textContent = `${item.location}`;
    labelDropdown.innerHTML+=`<i id='${item.location}' style='margin-left:24px;' class="bi bi-caret-down-fill"></i>`
    labelDropdown.style.cssText='margin-top:8px;display:flex;justify-content:space-between;'
    div.append(labelDropdown);
    labelDropdown.addEventListener('click',(event)=>{
        let labelDropdowns = document.querySelectorAll('.labelDropdown')
        labelDropdowns.forEach((label)=>{
            if(event.target.getAttribute('id') === label.getAttribute('id')) return
            label.remove()
        })
        selectElementCreator(div,item)
    } );
}
function selectElementCreator(div,item){
    let existingSelect = document.querySelector('.mtaaniSelect');
    if (existingSelect) {
        existingSelect.remove()
    }
    let agentsOptionsDiv = document.createElement('div');
    agentsOptionsDiv.style.cssText='max-height:30vh;overflow-y:auto;border-radius:8px;padding:4px;'
    agentsOptionsDiv.classList.add('mtaaniSelect')
    item.agents.forEach((agent) => {
        agentsOptionsDiv.innerHTML += `
        <div style='font-size:12px;'>
        <input type="radio" id="${agent}" name="agentLocation" value="${agent}">
        <label  for="${agent}">${agent}</label><br>
        </div>`
    });
    div.appendChild(agentsOptionsDiv);
}






//admin
async function adminModalFunc(isOn,agents){
    let availabilityCheckbox = document.getElementById('availability')
    let pickupMtaaniAgents = document.getElementById('pickupMtaaniAgents')
    let dropOffpointDiv = document.querySelector('#dropOffpointDiv')
    if(isOn){
        availabilityCheckbox.checked=true
        agentOptionsRender(pickupMtaaniAgents,agents)
    }
    if(!isOn){
        dropOffpointDiv.style.display='none'
    }
    availabilityCheckbox.addEventListener('click',(event)=>{
        availabilityToggleFunc(event,dropOffpointDiv,pickupMtaaniAgents,agents)
    })
}

async function availabilityToggleFunc(event,dropOffpointDiv,pickupMtaaniAgents,agents){
    dropOffpointDiv.style.display='flex'
    pickupMtaaniAgents.innerHTML='Loading...'
    if(event.target.checked == true){
        await fetch(`https://bralessnation.com/api/toggleAvailability?siteId=${getSiteId()}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                available: true
            }),
        })
        agentOptionsRender(pickupMtaaniAgents,agents)
    }else{
        dropOffpointDiv.style.display='none'
    }
}

function disableButton(event){
    event.target.disabled = true;
    // Re-enable the button after a delay:
    setTimeout(() => {
        event.target.disabled = false;
    }, 1500)
}

async function renderAdminModal(isOn,agents){
    let modalBackground = document.createElement('div')
    modalBackground.style.cssText='position:fixed;display:flex;justify-content:center;align-items:center;top: 0px;bottom: 0px;width: 100vw;background-color: rgba(26, 26, 26, 0.61);backdrop-filter: blur(1px);'
    let modal =  document.createElement('div')
    modal.style.cssText='background-color:white;padding:24px;'
    modalBackground.appendChild(modal)
    document.body.appendChild(modalBackground)
    modal.innerHTML=`<h1>Loaading...</h1>`
    modal.innerHTML=`
        <form action='https://bralessnation.com/api/config?siteId=${getSiteId()}' method='post'>
            <div>
                <label>Work with Pickup Mtaani:</label>
                <input id='availability' name='available' type='checkbox'>
            </div>
            <div id='dropOffpointDiv'>
                <h3  >Select drop off point:</h3>
                <div id='pickupMtaaniAgents'></div>
            </div>
            <button type='submit'>Submit</button>
        </form>
    `
    await adminModalFunc(isOn,agents)
}

window.pickUpMtaaniAdmin = async function(adminbtn){
    let agents = await getAgents()
    let {isOn} =await getSiteConfig()
    adminbtn.addEventListener('click',async(event)=>{
        disableButton(event)
        await renderAdminModal(isOn,agents)
    })
}








window.getPickupMtaaniCost = async function(){
    let {price} =await getSiteConfig()
    return price
}

window.pickUpMtaaniOption = async function(deliveryOptions,agentsSection,priceDiv=null) {
    let mainDropdown = document.createElement('div')
    mainDropdown.style.cssText = 'margin-top:12px;border:solid 1px;display:flex;justify-content:space-between;'
    let agentList = document.createElement('div')
    //agentList.style.cssText='display:none;'
    agentsSection.append(mainDropdown,agentList)
    /*mainDropdown.addEventListener('click',()=>{
        if(agentList.style.display !== 'none'){
            agentList.style.display='none'
        }else{
            agentList.style.display='block'
        }
    })*/
    let agents = await getAgents()
    let {isOn,price} =await getSiteConfig()
    if(agents==''){
        return
    }
    if(priceDiv!=null){
        priceDiv.innerText=await getPickupMtaaniCost(isOn,price)
    }
    let mtaaniOption =document.createElement('option')
    mtaaniOption.value='pickupMtaani'
    mtaaniOption.innerText='Pick up Mtaani'
    deliveryOptions.appendChild(mtaaniOption)
    deliveryOptions.addEventListener('change', function() {
        if (this.value === 'pickupMtaani') {
           /* mainDropdown.innerHTML=`
                Select agent
                <i class="bi bi-chevron-compact-down"></i>
                `*/
            agentOptionsRender(agentList,agents); 
        }else{
            //mainDropdown.innerHTML=''
            agentList.innerHTML=''
        }
    }); 
}