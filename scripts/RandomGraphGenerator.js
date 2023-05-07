/**
 * Генератор случайного ориентированного графа.
 * @class
 */
class RandomGraphGenerator {
  /**
   * Создает новый граф с заданным количеством вершин, диапазоном расстояний между вершинами и плотностью.
   * @constructor
   * @param {number} n - Количество вершин в графе.
   * @param {number} minDistance - Минимальное значение расстояния между вершинами.
   * @param {number} maxDistance - Максимальное значение расстояния между вершинами.
   * @param {number} density - Плотность графа (число от 0 до 1).
   */
  constructor(n, minDistance, maxDistance, density) {
    this.n = n;
    this.matrix = [];
    const maxEdges = n * (n - 1);
    const targetEdges = Math.floor(density * maxEdges);
    let edgesCount = 0;
    
    // Заполнение матрицы смежности случайными значениями
    for (let i = 0; i < n; i++) {
      this.matrix[i] = [];
      for (let j = 0; j < n; j++) {
        if (i === j) {
          this.matrix[i][j] = 0;
        } else {
          const distance = Math.floor(Math.random() * (maxDistance - minDistance + 1)) + minDistance;
          this.matrix[i][j] = Math.random() < 0.5 ? distance : Infinity;
          if (this.matrix[i][j] !== Infinity) {
            edgesCount++;
          }
        }
      }
    }
    
    // Добавление недостающих ребер
    while (edgesCount < targetEdges) {
      const i = Math.floor(Math.random() * n);
      const j = Math.floor(Math.random() * n);
      if (i !== j && this.matrix[i][j] === Infinity) {
        const distance = Math.floor(Math.random() * (maxDistance - minDistance + 1)) + minDistance;
        this.matrix[i][j] = distance;
        edgesCount++;
      }
    }
  }
  
  /**
   * Возвращает матрицу смежности графа.
   * @returns {number[][]} - Матрица смежности графа.
   */
  getMatrix() {
    return this.matrix;
  }
}
