/**
 * Класс для реализации алгоритма A* для поиска кратчайшего пути в матрице графа.
 */
class AStar {
    /**
     * Создает новый объект класса AStar.
     * @param {number[][]} graph - Матрица графа, где graph[i][j] - стоимость перехода из вершины i в вершину j. Если переход невозможен, то значение равно Infinity.
     * @param {number} start - Начальная вершина.
     * @param {number} end - Конечная вершина.
     */
    constructor(graph, start, end) {
      this.graph = graph;
      this.start = start;
      this.end = end;
      this.visited = new Set();
      this.queue = new PriorityQueue();
      this.parent = new Array(graph.length).fill(null);
      this.dist = new Array(graph.length).fill(Infinity);
      this.dist[start] = 0;
      this.queue.enqueue(start, 0);
    }
  
    /**
     * Выполняет поиск кратчайшего пути в матрице графа.
     * @returns {number[]} - Кратчайший путь от начальной вершины до конечной.
     */
    search() {
      while (!this.queue.isEmpty()) {
        const curr = this.queue.dequeue();
        if (curr === this.end) {
          return this.getPath();
        }
        if (this.visited.has(curr)) {
          continue;
        }
        this.visited.add(curr);
        for (let i = 0; i < this.graph[curr].length; i++) {
          const cost = this.dist[curr] + this.graph[curr][i];
          if (cost < this.dist[i]) {
            this.dist[i] = cost;
            this.parent[i] = curr;
            this.queue.enqueue(i, cost + this.heuristic(i));
          }
        }
      }
      return null;
    }
  
    /**
     * Вычисляет эвристическую функцию для вершины.
     * @param {number} vertex - Вершина.
     * @returns {number} - Значение эвристической функции.
     */
    heuristic(vertex) {
      // TODO: реализовать эвристическую функцию
      return 0;
    }
  
    /**
     * Возвращает кратчайший путь от начальной вершины до конечной.
     * @returns {number[]} - Кратчайший путь от начальной вершины до конечной.
     */
    getPath() {
      const path = [];
      let curr = this.end;
      while (curr !== null) {
        path.unshift(curr);
        curr = this.parent[curr];
      }
      return path;
    }
  }
  
/**
 * Класс для реализации очереди с приоритетом.
 */
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(item, priority) {
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.items.shift().item;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}