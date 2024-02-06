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
function addPickupMtaaniOption(availableOptions){
    let option = document.createElement('option')
    option.value='pickupMtaani'
    option.textContent='Pickup mtaani'
    availableOptions.appendChild(option)
}
function locationOptionsCreator(agents,locationSelect){
    agents.forEach((item)=>{
        let option = document.createElement('option')
        option.textContent=item.location
        option.value=item.location
        locationSelect.appendChild(option)
    })
}

function renderRoadsOptions(agents,displaySection){
    let locationSelect = document.createElement('select')
    locationSelect.innerHTML=`<option>Select agents</option>`
    locationOptionsCreator(agents,locationSelect)
    let agentsSection = document.createElement('div')
    agentsSection.style.cssText='max-height:30vh;overflow-y:auto;font-size:12px;padding:4px;'
    displaySection.append(locationSelect,agentsSection)
    locationSelect.addEventListener('change',(event)=>{
        agentsSection.innerHTML=''
        let location = event.target.value
        let item = agents.find(item=> item.location === location)
        item.agents.forEach((item)=>{
            agentsSection.innerHTML+=`<input type='radio' id='${item}' name='pickupMtaaniAgent' value='${item}'>`
            agentsSection.innerHTML+=`<label for='${item}'>${item}</label> <br>`
        })
    })
}

window.pickUpMtaaniOption = async function(deliveryOptions,displaySection,priceDiv=null) {
    let agents = await getAgents()
    let {isOn,price} =await getSiteConfig()
    if(agents==''){
        return
    }
    if(priceDiv!=null){
        priceDiv.innerText=await getPickupMtaaniCost(isOn,price)
    }
    addPickupMtaaniOption(deliveryOptions)
    deliveryOptions.addEventListener('change',(event)=>{
        if(event.target.value=='pickupMtaani'){
            renderRoadsOptions(agents,displaySection)
        }
    })
    
}