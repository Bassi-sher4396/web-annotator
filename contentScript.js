let tabinfo =`random string`
let changes = []

function getNodeFromSelectorPath(selectorPath) {
    const parts = selectorPath.split(" > ");
    let currentNode = document;

    for (let part of parts) {
        if (part.startsWith("#text")) {
           
            const match = part.match(/:nth-child\((\d+)\)/);
            if (match) {
                const index = parseInt(match[1], 10) - 1;
                const parent = currentNode;
                currentNode = parent.childNodes[index];
            } else {
                console.error("Invalid text node path:", part);
                return null;
            }
        } else {
            currentNode = currentNode.querySelector(part);
            if (!currentNode) {
                console.error("Invalid selector part:", part);
                return null;
            }
        }
    }

    return currentNode;
}

function missionreload(){
chrome.storage.sync.get(['tabinfo'],(data)=>{
    tabinfo=data.tabinfo||''
    console.log(tabinfo);   
    

    chrome.storage.sync.get([tabinfo],(data)=>{
        changes = data[tabinfo]?JSON.parse(data[tabinfo]):[]

    
    console.log(changes);
    
    if(changes.length>0){
        changes.forEach((everychange)=>{
          const ss=everychange.startconti
          const ee=everychange.endconti
          console.log(typeof(getNodeFromSelectorPath(ss)));
          console.log(ee);
          
          
            const startcontainer=getNodeFromSelectorPath(ss)
            const endcontainer=getNodeFromSelectorPath(ee);

            const startoff = everychange.startoff
            const endoff = everychange.endoff
            const range = document.createRange()
            range.setStart(startcontainer,startoff)
            range.setEnd(endcontainer,endoff)
const text =everychange.text
const span = document.createElement('span')
span.textContent=text
if(everychange.color){
    span.style.backgroundColor=everychange.color
}
if(everychange.title){
    span.title=everychange.title
}
range.deleteContents()
range.insertNode(span)
        })
    }})})
}

function getContainerPath(node) {
    let path = [];
    while (node) {
        let name = node.nodeName.toLowerCase();
       
        if (node.id) {
            name += `#${node.id}`;
            path.unshift(name);
            break;
        } else {
            let sibling = node;
            let index = 0;
           
            while ((sibling = sibling.previousElementSibling)) {
                index++;
            }
            
            name += `:nth-child(${index + 1})`;
        }
        path.unshift(name);
        node = node.parentElement; 
    }
    return path.join(" > "); 
}

chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, taburl } = obj;

    if (type === 'url') {
        let tabinfo = `${taburl}`;
        console.log(tabinfo);
        chrome.storage.sync.set({tabinfo: tabinfo})
missionreload()

   
    }
  else  if (type === 'highlight') {
        const Color = value;
        console.log(`${Color}`);

        const selectedText = window.getSelection();
        const range = selectedText.getRangeAt(0);
        const startcont = getContainerPath(range.startContainer)
        const endcont = getContainerPath(range.endContainer)
const startoff = range.startOffset
const endoff = range.endOffset
        console.log(typeof(startcont));
        console.log(startcont instanceof Node);
        console.log(Node);
        
        const span = document.createElement('span');
        span.classList.add('highlight');
        span.style.backgroundColor = Color;

        
        span.textContent = range.toString();

        
        range.deleteContents();
        range.insertNode(span);

       
        
        span.setAttribute("highlight", Color);
const newchange = {
    startconti:startcont,
    endconti:endcont,
    startoff:startoff,
    endoff:endoff,
    color:Color,
    text:span.textContent
}
changes.push(newchange)
console.log(changes);

        chrome.storage.sync.set({[tabinfo]:JSON.stringify(changes)})

    }
    else if (type === 'add note') {
        const note = value;

        const selectedText = window.getSelection();
        const range = selectedText.getRangeAt(0);
        const startcont = getContainerPath(range.startContainer)
        const endcont = getContainerPath(range.endContainer)
        const startoff = range.startOffset
        const endoff = range.endOffset
        const highlightedSpans = range.commonAncestorContainer.querySelectorAll('.highlight');
       
        
        if (highlightedSpans.length === 0) {
            
            const span = document.createElement('span');
            span.textContent = range.toString();
            span.title = note;
            span.className = 'note';
            span.style.backgroundColor = 'rgba(255, 255, 255, 0)';
            span.setAttribute('notes', note);

            
            range.deleteContents();
            range.insertNode(span);

const newchange ={
    startconti:startcont,
    endconti:endcont,
    startoff:startoff,
    endoff:endoff,
    title:note,
    text:span.textContent
}
changes.push(newchange)
chrome.storage.sync.set({[tabinfo]:JSON.stringify(changes)})
console.log(changes);

        } else {
           
            highlightedSpans.forEach(highlight => {
                highlight.title = note; 
                highlight.classList.add('note');
                highlight.setAttribute('notes', note);
               const color=highlight.getAttribute
               ('highlight')
               const content= highlight.textContent
               const newchange={
                startconti:startcont,
                endconti:endcont,
                startoff:startoff,
                endoff:endoff,
                color:color,
                title:note,
                text:content
               }
               changes.push(newchange)
               chrome.storage.sync.set({[tabinfo]:
                JSON.stringify(changes)
                      
               })
               console.log(changes);
               
            });
        }
    }
});
