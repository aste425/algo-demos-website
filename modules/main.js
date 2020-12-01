import { createNodesArray, printNodes, addNewNode } from '/modules/createNodes.js';
import { dragElements, disableNodeDrag } from '/modules/dragNode.js'
import { drawLines } from '/modules/drawLines.js'
import { selectNodes, stopNodeSelection, showStartAndEnd } from '/modules/selectNodes.js'
import { lineSelection } from '/modules/selectLines.js'
import { shortestPath } from './computeShortestPath.js' 
import { animatePath } from './animations.js'
import { checkUserAnswer } from './checkAnswer.js'

let nextButton = document.getElementById('next-button')
let addNodeButton = document.getElementById('add-node-button')

let nodes = []
let lines = []
let selectedNodesArray = []
let selectedLines = []
let userAnswerValue = false

let currentState = ''


function setUp(){
    currentState = 'setup'

    // add button listeners to buttons
    nextButton.addEventListener('click', selectStartAndEndNode)
    addNodeButton.addEventListener('click', addAnotherNode)

    // create 5 new nodes to place on the screen and print them.
    nodes = createNodesArray(6)
    printNodes(nodes)
    lines = drawLines(nodes, lines)
    // allow these nodes to be dragged
    dragElements(nodes, lines)
}


function addAnotherNode(){
    currentState = 'added node'
    nodes = addNewNode(nodes)
    printNodes(nodes)
    lines = drawLines(nodes, lines)
    dragElements(nodes, lines)
}

function displayTextUnderTitle(text){

    let parentElement = document.getElementById('text-space')
    parentElement.innerHTML = `<p>${text}</p>`
}

function deleteTopButtons(){
    document.getElementById('button-div').innerHTML = ''
}

// once two nodes have been selected we can allow the user to draw a path between these nodes
export function selectLinesBetweenNodes(array){

    currentState = 'user path'
    // now disable the ability to add nodes to the array
    stopNodeSelection(nodes)

    // display new text to the screen
    displayTextUnderTitle('Click on lines between nodes to input your path')

    // show start and end nodes
    showStartAndEnd(array)

    lineSelection(nodes, lines, array)

}

export function validateUserAnswer(pathSelected){
    currentState = 'showing answer'

    displayTextUnderTitle('Computing shortest path now...')
    
    const path = shortestPath(lines, nodes, selectedNodesArray)
    
    userAnswerValue = checkUserAnswer(path, pathSelected)

    animatePath(lines, path)
}

export function demoDone(){

    if(userAnswerValue){
        displayTextUnderTitle('Scroll down to see how this works')
    }else{
        displayTextUnderTitle('Scroll down to see how this works or play again.')
        const buttonDiv = document.getElementById('button-div')
        const newButton = document.createElement('button')
        newButton.innerHTML = 'Play Again'
        newButton.setAttribute('id', 'play-again-button')
        newButton.onclick = startDemoAgain
        buttonDiv.appendChild(newButton)
    }
}

export function updateLines(newLines){
    lines = newLines
}

function selectStartAndEndNode(){

    disableNodeDrag(nodes)

    deleteTopButtons()

    displayTextUnderTitle('Select a start and an end node')

    selectNodes(nodes, selectedNodesArray, lines)
}

function startDemoAgain(){
    document.getElementById('nodes-div').innerHTML = ''
    displayTextUnderTitle('Drag Nodes and add new Nodes to create map')
    createButtonsAgain()
    setUp()
}

function createButtonsAgain(){
    const parentDiv = document.getElementById('button-div')
    parentDiv.innerHTML = ''

    addNodeButton = document.createElement('button')
    addNodeButton.innerHTML = 'Add Node'
    addNodeButton.setAttribute('id', 'add-node-button')

    parentDiv.appendChild(addNodeButton)
}

const resizeEvent = () => {
    if(currentState == 'setup'){
        printNodes(nodes)
        lines = drawLines(nodes, lines)
        dragElements(nodes, lines)
    }else if(currentState == 'added node'){
        printNodes(nodes)
        lines = drawLines(nodes, lines)
        dragElements(nodes, lines)
    }
}

window.addEventListener('resize', resizeEvent)

setUp()