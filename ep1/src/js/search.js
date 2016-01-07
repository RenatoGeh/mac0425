"use strict";

// EP1 - MAC0425
// Renato Lui Geh
// NUSP: 8536030

// ---------------------------------------------------------------------------
// Nós da busca (Search nodes)
// ---------------------------------------------------------------------------

// Construtor da estrutura Nó da árvore de busca
var Node = function (action, parent, state, depth, g, h) {
	this.state = state;     // representação do estado do nó
	this.parent = parent;   // nó pai na árvore de busca
	this.action = action;   // ação que gerou o nó
	this.depth = depth;     // profundidade do nó na árvore de busca
	this.g = g;             // custo de caminho até o nó
	this.h = h;             // heurística de custo até meta
};


// Recupera o caminho (sequência de ações) do nó raiz até nó corrente.
Node.prototype.getPath = function () {
	var path = [];
	var node = this;
	while (node.parent !== null) {
		path.unshift(node.action);
		node = node.parent;
	}
	return path;
};

Node.prototype.toString = function() {
  return this.state.toString() + this.action;
}

// ==========================================================================================
// Buscas não-informadas (cegas)


// ---------------------------------------------------------------------------
// Busca em Profundidade (Depth-First Search)
// ---------------------------------------------------------------------------
var DFS = function (problem) {

	// retorno da função: mantenha essa interface!!!
	// solução e estatísticas de busca
	var result = {
		solution: null,   // solução: sequência de ações
		generated: 0,     // número de nós gerados
		expanded: 0,      // número de nós expandidos
		ramification: 0   // fator de ramificação médio
	}

  var set = new Set();
  var st_node = new Stack(); 
  var actions = problem.Actions(problem.initialState);
  var state = problem.initialState;
  var i;

  var root = new Node("noop", null, state, 0, 0, 0);

  for (i=0;i<actions.length;++i) {
    var n = new Node(actions[i], root, problem.Result(state, actions[i]), 
          1, problem.StepCost(), 0);
    set.add(n);
    st_node.push(n);
  }
  
  result.generated = i;
  result.expanded = 1;

  while (!st_node.empty()) {
    var c_node = st_node.pop();
    state = c_node.state; 
  
    if (problem.GoalTest(state)) {
      result.solution = c_node.getPath();
      result.ramification = result.generated/result.expanded;

      return result;
    } 

    actions = problem.Actions(state);
    for (i=0;i<actions.length;++i) {
      var n = new Node(actions[i], c_node, 
            problem.Result(state, actions[i]), c_node.depth + 1, 
            c_node.g + problem.StepCost(state, actions[i]), 0);
     
      if (set.hasElement(n))
        continue;

      st_node.push(n);
      set.add(n);
      ++result.generated;
    }

    ++result.expanded;
  } 

	return result;
};

// ---------------------------------------------------------------------------
// Busca em Largura (Breadth-First Search)
// ---------------------------------------------------------------------------
var BFS = function (problem) {

	// retorno da função: mantenha essa interface!!!
	// solução e estatísticas de busca
	var result = {
		solution: null,   // solução: sequência de ações
		generated: 0,     // número de nós gerados
		expanded: 0,      // número de nós expandidos
		ramification: 0   // fator de ramificação médio
	}

  var set = new Set();
  var q_node = new Queue();
  var state = problem.initialState;
  var root = new Node("noop", null, state, 0, 0, 0);
  var actions = problem.Actions(state);
  var i;

  for (i=0;i<actions.length;++i) {
    var n = new Node(actions[i], root, problem.Result(state, actions[i]), 1, problem.StepCost(), 0);
    q_node.put(n);
    set.add(n);
  }
  
  result.generated = i;
  result.expanded = 1;

  while (!q_node.empty()) {
    var c_node = q_node.get();
    state = c_node.state;

    if (problem.GoalTest(state)) {
      result.solution = c_node.getPath();
      result.ramification = result.generated/result.expanded;

      return result;
    }

    actions = problem.Actions(state);
    for (i=0;i<actions.length;++i) {
      var n = new Node(actions[i], c_node, problem.Result(state, actions[i]), 
          c_node.depth + 1, c_node.g + problem.StepCost(state, actions[i]), 0);
      
      if (set.hasElement(n))
        continue;
      
      q_node.put(n);
      set.add(n);
      ++result.generated;
    }

    ++result.expanded;
  }

	return null; // retorna falha se não encontrou solução
};



// ==========================================================================================
// Buscas informadas


// Heurística da distância de manhatttan: devolve a distância de manhattan
// entre a posição do tetraminó do estado s1 e a posição do tetraminó do estado s2
var manhattanDistance = function (s1, s2) {
	return Math.abs(s1.tetromino.xpos - s2.tetromino.xpos) + Math.abs(s1.tetromino.ypos - s2.tetromino.ypos);
};

var manhattanDistanceAdmissible = function (s1, s2) {
  return Math.abs(s1.tetromino.xpos - s2.tetromino.xpos); 
};

var betterHeuristics = function(s1, s2) {
  return Math.abs(s1.tetromino.xpos - s2.tetromino.xpos) + 
    Math.abs(s1.tetromino.type.next - s2.tetromino.type.next);
}

// ---------------------------------------------------------------------------
// Busca de melhor escolha (Best-First Search)
// ---------------------------------------------------------------------------
var BestFS = function (problem) {

	// retorno da função: mantenha essa interface!!!
	// solução e estatísticas de busca
	var result = {
		solution: null,   // solução: sequência de ações
		generated: 0,     // número de nós gerados
		expanded: 0,      // número de nós expandidos
		ramification: 0   // fator de ramificação médio
	}

  var set = new Set();
  var pq_node = new PQueue(function(node) { return node.g; });
  var state = problem.initialState;
  var root = new Node("noop", null, state, 0, 0, 0);
  var actions = problem.Actions(state);
  var i;
   
  for (i=0;i<actions.length;++i) {
    var c_state = problem.Result(state, actions[i]);
    var n = new Node(actions[i], root, c_state, 1, problem.StepCost(), 0);
    pq_node.put(n);
    set.add(n);
  }

  result.generated = i;
  result.expanded = 1;

  while (!pq_node.empty()) {
    var c_node = pq_node.get();
    var c_state = c_node.state;

    if (problem.GoalTest(c_state)) {
      result.solution = c_node.getPath();
      result.ramification = result.generated/result.expanded;

      return result;
    }

    actions = problem.Actions(c_state);
    for (i=0;i<actions.length;++i) {
      var n = new Node(actions[i], c_node, problem.Result(c_state, actions[i]), 
            c_node.depth + 1, c_node.g + problem.StepCost(), 0);
      
      if (set.hasElement(n))
        continue;
      
      pq_node.put(n);
      set.add(n);

      ++result.generated;
    }

    ++result.expanded;
  }
  
  return null; // retorna falha se não encontrou solução
};


// ---------------------------------------------------------------------------
// Busca A*
// ---------------------------------------------------------------------------
var ASTAR = function (problem) {

	// retorno da função: mantenha essa interface!!!
	// solução e estatísticas de busca
	var result = {
		solution: null,   // solução: sequência de ações
		generated: 0,     // número de nós gerados
		expanded: 0,      // número de nós expandidos
		ramification: 0   // fator de ramificação médio
	}

  var set = new Set();
	var pq_node = new PQueue(function(node) { return node.g + node.h; });
  var state = problem.initialState;
  var root = new Node("noop", null, state, 0, 0, 0);
  var actions = problem.Actions(state);
  var i;
   
  for (i=0;i<actions.length;++i) {
    var c_state = problem.Result(state, actions[i]);
    var n = new Node(actions[i], root, c_state, 1, problem.StepCost(), 
          betterHeuristics(c_state, problem.goalState));
    pq_node.put(n);
    set.add(n);
  }

  result.generated = i;
  result.expanded = 1;

  while (!pq_node.empty()) {
    var c_node = pq_node.get();
    var c_state = c_node.state;

    if (problem.GoalTest(c_state)) {
      result.solution = c_node.getPath();
      result.ramification = result.generated/result.expanded;

      return result;
    }

    actions = problem.Actions(c_state);
    for (i=0;i<actions.length;++i) {
      var n_state = problem.Result(c_state, actions[i]);
      var n = new Node(actions[i], c_node, n_state, 
            c_node.depth + 1, c_node.g + problem.StepCost(), 
            betterHeuristics(n_state, problem.goalState));
      
      if (set.hasElement(n))
        continue;
      
      pq_node.put(n);
      set.add(n);

      ++result.generated;
    }

    ++result.expanded;
  }


	return null; // retorna falha se não encontrou solução
};
