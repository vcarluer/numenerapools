function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

var numenerapool = {
    run: function() {
        this.mainDiv = document.getElementById('numenerapool');
        this.pools = {};
        this.createPool('might', 'Puissance');
        this.createPool('speed', 'Célérité');
        this.createPool('intellect', 'Intellect');
    },
    
    createPool: function(poolName, poolCaption) {
        var pool = new statPool();
        this.pools[poolName] = pool;
        pool.create(this.mainDiv, poolName, poolCaption);
    }
};

function statPool() {
    this.create = function(div, css, name) {
        this.name = name;
        this.poolDiv = document.createElement('div');
        this.poolDiv.innerHTML = this.name;
        this.poolDiv.className = css;
        div.appendChild(this.poolDiv);
        
        this.stat = 10;
        this.minusDiv = document.createElement('div');
        this.minusDiv.innerHTML = '-';
        this.statDiv = document.createElement('div');
        this.setStat();
        this.addDiv = document.createElement('div');
        this.addDiv.innerHTML = "+";
        
        this.poolDiv.appendChild(this.minusDiv);
        this.poolDiv.appendChild(this.statDiv);
        this.poolDiv.appendChild(this.addDiv);
        
        var self = this;
        this.minusDiv.onclick = function() {
            self.stat--;
            self.setStat();
        };
        
        this.addDiv.onclick = function() {
            self.stat++;
            self.setStat();
        };
    };
    
    this.setStat = function() {
        this.statDiv.innerHTML = this.stat.toString();
    };
}

ready(function() {
    numenerapool.run();   
});