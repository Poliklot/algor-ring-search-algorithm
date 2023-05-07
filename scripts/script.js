let queueShow = [];
let arrayToQueue = [];

const addToQueue = (fn) => {
  queueShow.push(fn);
}

setInterval(() => {
    if (queueShow.length > 0) {
        if (queueShow[0].length > 0) {
            queueShow[0].forEach(item => item());
        }
        queueShow.shift();
    }
}, 700)

/**
 * Отображает граф на странице с помощью библиотеки vivagraph.js
 * @param {Array<Array<number>>} graph - матрица смежности графа
 * @param {string} containerId - идентификатор контейнера, в котором будет отображаться граф
 */
function displayGraph(graph, containerId) {
    const graphContainer = document.querySelector(containerId);
    const graphData = {
      nodes: [],
      links: [],
    };
  
    // добавляем вершины в граф
    for (let i = 0; i < graph.length; i++) {
      graphData.nodes.push({ id: i });
    }
  
    // добавляем ребра в граф
    for (let i = 0; i < graph.length; i++) {
      for (let j = 0; j < graph[i].length; j++) {
        if (graph[i][j] !== 0) {
          graphData.links.push({ from: i, to: j, data: {connectionStrength: graph[i][j]} });
        }
      }
    }
    
      const graphUI = Viva.Graph.graph();
      for (var i = 0; i < graphData.nodes.length; ++i){
          graphUI.addNode(i, graphData.nodes[i]);
      }
  
      for (i = 0; i < graphData.links.length; ++i){
          const link = graphData.links[i];
          graphUI.addLink(link.from, link.to, link.data);
      }
  
    // создаем объект графа и отображаем его на странице
      
      graphData.nodes.forEach(node => {
          const nodeObj = graphUI.addNode(node.id);
      });
      graphData.links.forEach(link => graphUI.addLink(link.to, link.from));
      var svgGraphics = Viva.Graph.View.svgGraphics();
  
      svgGraphics.node(function(node){
          // const groupId = node.data.group;
          const ui = Viva.Graph.svg('g')
              .attr('id', `n-${node.id}`)
              .attr("pointer-events", "none"),
              svgText = Viva.Graph.svg('text')
              .attr('y', '-10px')
              .attr('x', '-4px')
              .attr('fill', '#5dff00')
              .attr('font-size', '50px')
              .attr('font-weight', '600')
              .text(node.id),
              svgCircle = Viva.Graph.svg('circle')
              .attr('r', 7)
              .attr('stroke', '#fff')
              .attr('stroke-width', '1.5px')
              .attr("fill", '#fff');
  
          ui.append(svgText)
          ui.append(svgCircle)
          return ui;
      })
      .placeNode(function(nodeUI, pos){
          nodeUI.attr('transform', `translate(${pos.x}, ${pos.y})`)
          nodeUI.attr("cx", pos.x).attr("cy", pos.y);
      });
  
          // Задаем отображение ребер
      svgGraphics.link(function(link) {
          if ((!link.data) || (link.fromId == link.toId)) return null
          const g = Viva.Graph.svg('g');
  
          const line = Viva.Graph.svg('line')
          .attr('stroke', '#999999')
          .attr('id', `l-${link.fromId}-${link.toId}`)
          .attr('stroke-width', 2);
  
          g.append(line)
          return g;
      })
      .placeLink(function(linkUI, fromPos, toPos) {
          linkUI.querySelector('line')
              .attr('x1', fromPos.x)
              .attr('x2', toPos.x)
              .attr('y1', fromPos.y)
              .attr('y2', toPos.y);
  
          const dx = toPos.x - fromPos.x,
              dy = toPos.y - fromPos.y,
              distance = Math.sqrt(dx * dx + dy * dy);
      });
  
      const idealLength = 90;
      const getLayout = () => {
          const layout = Viva.Graph.Layout.forceDirected(graphUI, {
              springLength: 400,
              springCoeff : 0.00001,
              gravity : -11.85,
              springTransform: function (link, spring) {
                  if (link.data) spring.length = link.data.connectionStrength;
              }
          });
          return layout;
      }
      let layout;
      const renderer = Viva.Graph.View.renderer(graphUI, {
          graphics: svgGraphics,
          container: graphContainer,
          layout: layout = getLayout(),
          renderLinks: true,
          prerender: 2600
      });
      renderer.run();
      
      // Zoom to fit hack
      const graphRect = layout.getGraphRect();
      const graphSize = Math.min(graphRect.x2 - graphRect.x1, graphRect.y2 - graphRect.y1) + 500;
      const screenSize = Math.min(document.body.clientWidth, document.body.clientHeight);
  
      const desiredScale = screenSize / graphSize;
      zoomOut(desiredScale, 1);
  
      function zoomOut(desiredScale, currentScale) {
          if (desiredScale < currentScale) {
              currentScale = renderer.zoomOut();
              setTimeout(function () {
                  zoomOut(desiredScale, currentScale);
              }, 16);
          }
      }
}

function generateRandomGraph(numVertices, numEdges, mustHasOneEdge = true) {
    let graph = [];
    for (let i = 0; i < numVertices; i++) {
      graph.push([]);
      for (let j = 0; j < numVertices; j++) {
        graph[i].push(0);
      }
    }

    let edges = 0;
    while (edges < numEdges) {
      let from = Math.floor(Math.random() * numVertices);
      let to = Math.floor(Math.random() * numVertices);
      if (from !== to && graph[from][to] === 0) {
        graph[from][to] = 1;
        graph[to][from] = 1;
        edges++;
      }
    }

    if (mustHasOneEdge) {
        const nodesWithOutEdges = [];
        graph.forEach((arr, i) => {
            let hasEdges = false;
            for(let j = 0; j < arr.length; j++) {
                if (arr[j] == 1) {
                    hasEdges = true;
                    break;
                }
            }
            if (hasEdges == false) {
                arr[Math.floor(Math.random() * numVertices)] = 1;
                // console.log(arr)
            }
        })
    }

    return graph;
}

function findShortestPath(graph, start, end) {
    document.querySelector(`svg g > g#n-${start}`).querySelector('text').setAttribute('font-size', '68px');
    document.querySelector(`svg g > g#n-${start}`).querySelector('text').setAttribute('fill', 'blue');
    document.querySelector(`svg g > g#n-${start}`).querySelector('circle').setAttribute('r', '11');
    document.querySelector(`svg g > g#n-${start}`).querySelector('circle').setAttribute('fill', 'blue');

    document.querySelector(`svg g > g#n-${end}`).querySelector('text').setAttribute('font-size', '68px');
    document.querySelector(`svg g > g#n-${end}`).querySelector('text').setAttribute('fill', 'blue');
    document.querySelector(`svg g > g#n-${end}`).querySelector('circle').setAttribute('r', '11');
    document.querySelector(`svg g > g#n-${end}`).querySelector('circle').setAttribute('fill', 'blue');
    
    let queue = [start];
    let visited = new Set();
    let parent = new Map();
    visited.add(start);
    while (queue.length > 0) {
      const showArray = [];
      let current = queue.shift();
      if (current === end) {
        let path = [end];
        while (path[path.length - 1] !== start) {
          path.push(parent.get(path[path.length - 1]));
        }
        return path.reverse();
      }
      for (let index = 0; index <  graph[current].length; index++) {
        const neighbor = (graph[current][index] == 1) ? index : 0;
        if (neighbor && !visited.has(neighbor)) {
            showArray.push(() => {
              const $node = document.querySelector(`svg g > g#n-${neighbor}`);
              $node.querySelector('text').setAttribute('fill', 'red');
              $node.querySelector('circle').setAttribute('fill', 'red');
            });
            
            visited.add(neighbor);
            parent.set(neighbor, current);
            queue.push(neighbor);
        }
      }
      queueShow.push(showArray);
      if (queue[0] === start) {
        queue.push(queue.shift());
      }
    }
    return null;
}

// Start

// Первая инициализация
let data;
displayGraph(data = generateRandomGraph(40, 60), '.graph-container');


// DOM
const currentNodeElements = {$fromNode: null, $toNode: null}

// Вешаем событие на нажатие на кнопку генерации нового графа
document.querySelector('#buttonCreateRandomGraph').addEventListener('click', () => {
    document.querySelector('.graph-container svg')?.remove();
    displayGraph(data = generateRandomGraph(40, 60), '.graph-container');
})

// Вешаем событие на нажатие на кнопку поиска кратчайшего пути
document.querySelector('#buttonFindPath').addEventListener('click', () => {
    if ((currentNodeElements.$fromNode == null) || (currentNodeElements.$toNode == null)) return null;
    const from = +document.querySelector('#inputNodeFrom').value;
    const to = +document.querySelector('#inputNodeTo').value;
    if (from && to && (from > -1) && (to > -1) && (from != to)) {
      const shortestPath = findShortestPath(data, from, to);
      queueShow.push([() => {
        document.querySelector(`svg g > g#n-${to}`).querySelector('text').setAttribute('font-size', '68px');
        document.querySelector(`svg g > g#n-${to}`).querySelector('text').setAttribute('fill', 'blue');
        document.querySelector(`svg g > g#n-${to}`).querySelector('circle').setAttribute('r', '11');
        document.querySelector(`svg g > g#n-${to}`).querySelector('circle').setAttribute('fill', 'blue');
      }]);
      shortestPath.reverse().forEach((nodeIndex, index, arr) => {
        if (index != 0) {
          queueShow.push([() => {
            const $line1 = document.querySelector(`svg g > g > line#l-${arr[index - 1]}-${nodeIndex}`);
            const $line2 = document.querySelector(`svg g > g > line#l-${nodeIndex}-${arr[index - 1]}`);
            $line1?.setAttribute('stroke', 'blue');
            $line1?.setAttribute('stroke-width', '4');
            $line2?.setAttribute('stroke', 'blue');
            $line2?.setAttribute('stroke-width', '4');
      
            const $node = document.querySelector(`svg g > g#n-${nodeIndex}`);
            $node.querySelector('text').setAttribute('fill', 'blue');
            $node.querySelector('circle').setAttribute('fill', 'blue');
          }]);
        }
      })
      queueShow.push([() => {
        const nodesShown = document.querySelectorAll(`svg g > g > text[fill="red"]`);
        nodesShown.forEach($text => {
          const $node = $text.parentElement;
          $node.querySelector('text').setAttribute('fill', '#5dff00');
          $node.querySelector('circle').setAttribute('fill', '#fff');
        })
      }]);
      queueShow.push([() => {
        setTimeout(() => {
          document.querySelectorAll(`svg g > g > line[stroke="blue"]`).forEach($line => {$line.setAttribute('stroke', '#999999')});
          document.querySelectorAll(`svg g > g > text[fill="blue"]`).forEach($text => {
            const $node = $text.parentElement;
            $node.querySelector('text').setAttribute('font-size', '50px');
            $node.querySelector('text').setAttribute('fill', '#5dff00');
            $node.querySelector('circle').setAttribute('r', '7');
            $node.querySelector('circle').setAttribute('fill', '#fff');
          });
        }, 3000)
      }]);
    }
})

// Вешаем событие на поля ввода
const showCurrentNode = ($node) => {
  $node.querySelector('text').setAttribute('font-size', '68px');
  $node.querySelector('text').setAttribute('fill', 'blue');
  $node.querySelector('circle').setAttribute('r', '11');
  $node.querySelector('circle').setAttribute('fill', 'blue');
}

const hideCurrentNode = ($node) => {
  $node.querySelector('text').setAttribute('font-size', '50px');
  $node.querySelector('text').setAttribute('fill', '#5dff00');
  $node.querySelector('circle').setAttribute('r', '7');
  $node.querySelector('circle').setAttribute('fill', '#fff');
}
  
const $inputNodeFrom = document.querySelector('#inputNodeFrom');
$inputNodeFrom.addEventListener('input', () => {
  const $node = document.querySelector(`svg g > g#n-${$inputNodeFrom.value}`);
  if (currentNodeElements.$fromNode != $node) {
    if (currentNodeElements.$fromNode !== null) {
      hideCurrentNode(currentNodeElements.$fromNode);
    }
    if ($node) {
      currentNodeElements.$fromNode = $node;
      showCurrentNode($node)
    } else {
      currentNodeElements.$fromNode = null;
    }
  }
})

const $inputNodeTo = document.querySelector('#inputNodeTo');
$inputNodeTo.addEventListener('input', () => {
  const $node = document.querySelector(`svg g > g#n-${$inputNodeTo.value}`);
  if (currentNodeElements.$toNode != $node) {
    if (currentNodeElements.$toNode !== null) {
      hideCurrentNode(currentNodeElements.$toNode);
    }
    if ($node) {
      currentNodeElements.$toNode = $node;
      showCurrentNode($node)
    } else {
      currentNodeElements.$toNode = null;
    }
  }
})