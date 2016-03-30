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
        this.css = css;
        this.poolDiv.className = 'pool';
        div.appendChild(this.poolDiv);
        
        var storedStat = localStorage.getItem(this.css);
        if (!storedStat) {
            this.stat = 10;
        } else {
            this.stat = storedStat;
        }
        
        this.minusDiv = document.createElement('div');
        this.minusDiv.className = 'minus';
        this.minusDiv.innerHTML = '-';
        
        
        this.statContainerDiv = document.createElement('div');
        this.statContainerDiv.className = 'statContainer ' + this.css;
        
        this.poolTitle = document.createElement('div');
        this.poolTitle.className = 'poolTitle';
        this.poolTitle.innerHTML = this.name;
        this.statContainerDiv.appendChild(this.poolTitle);
        
        this.statDiv = document.createElement('div');
        this.statDiv.className = 'stat';
        this.setStat();
        this.statContainerDiv.appendChild(this.statDiv);
        
        this.addDiv = document.createElement('div');
        this.addDiv.className = 'add';
        this.addDiv.innerHTML = "+";
        
        this.poolDiv.appendChild(this.minusDiv);
        this.poolDiv.appendChild(this.statContainerDiv);
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
        localStorage.setItem(this.css, this.stat);
    };
}

ready(function() {
    numenerapool.run();   
});