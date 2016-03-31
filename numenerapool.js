/*global localStorage*/
/*global navigator*/

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

var fr = {
    'might': 'Puissance',
    'speed': 'Célérité',
    'intellect': "Intellect",
    'npc': "PNJ",
    'delete': 'Supprimer'
}

var uk = {
    'might': 'Might',
    'speed': 'Speed',
    'intellect': "Intellect",
    'npc': "NPC",
    'delete': 'Delete'
}

var numenerapool = {
    run: function() {
        this.mainDiv = document.getElementById('numenerapool');
        this.pools = {};
        var language = this.getLanguage();
        //this.createModes(language);
        this.createPlayerStats(language);
        this.createGMStats(language)
    },
    
    createPlayerStats: function(language) {
        var playerDiv = document.createElement('div');
        playerDiv.setAttribute('id', 'playerDiv');
        playerDiv.className = 'tableDiv';
        this.mainDiv.appendChild(playerDiv);
        
        this.createPlayerPool('might', language, playerDiv);
        this.createPlayerPool('speed', language, playerDiv);
        this.createPlayerPool('intellect', language, playerDiv);
    },
    
     createGMStats: function(language) {
        var gmDiv = document.createElement('div');
        gmDiv.setAttribute('id', 'gmDiv');
        gmDiv.className = 'gmDiv';
        this.mainDiv.appendChild(gmDiv);
        
        var storedPools = localStorage.getItem('gmPoolArray');
        if (storedPools) {
            this.gmPoolArray = JSON.parse(storedPools);
            for (var i = 0; i < this.gmPoolArray.length; i++) {
                if (this.gmPoolArray[i]) {
                    this.createGMPool(this.gmPoolArray[i].name, language, gmDiv, this.gmPoolArray[i].caption);
                }
                
            }
        }
        
        this.createGMAdd(gmDiv, language);
    },
    
    getLanguage: function() {
        var lang = getParameterByName('lang');
        if (!lang) lang = navigator.language;
        
        var frenchFlag = document.getElementById('frImg');
        var englishFlag = document.getElementById('ukImg');
        
        if (!lang || lang !== 'fr') {
            englishFlag.style.opacity = 0.8;
            return uk;
        } else {
            frenchFlag.style.opacity = 0.8;
            return fr;    
        }
    },
    
    gmPoolArray: [],
    
    createGMPool: function(poolName, language, div, poolCaption) {
        
        var poolVignette = document.createElement('div');
        poolVignette.setAttribute('id', poolName + "-vignette");
        poolVignette.className = 'poolVignette';
        var self = this;
        poolVignette.onclick = function() {
            if (self.selectedVignette) {
                self.selectedVignette.className = 'poolVignette'
            }
            self.selectedVignette = poolVignette;
            poolVignette.className = 'poolVignette selectedVignette';
            var deleteDiv = document.createElement('div');
            deleteDiv.innerHTML = language['delete'];
            poolVignette.appendChild(deleteDiv);
            deleteDiv.onclick = function() {
                div.removeChild(poolVignette);
                self.selectedVignette = null;
                for(var i = 0; i < self.gmPoolArray.length; i++) {
                    if (self.gmPoolArray[i]) {
                        if (self.gmPoolArray[i].name === poolName) {
                            delete self.gmPoolArray[i];
                            break;
                        }
                    }
                }
                
                self.storeGMArray();
            }
        }
        
        div.appendChild(poolVignette);
        var tableDiv = document.createElement('div');
        tableDiv.className = 'tableDiv';
        poolVignette.appendChild(tableDiv);
        this.createPool(poolName, tableDiv, poolCaption);
    },
    
    createPlayerPool: function(poolName, language, div) {
        this.createPool(poolName, div, language[poolName]);
    },
    
    createPool: function(poolName, tableDiv, caption) {
        var pool = new statPool();
        this.pools[poolName] = pool;
        pool.create(tableDiv, poolName, caption);
    },
    
    createGMAdd: function(gmDiv, language) {
        var addVignette = document.createElement('div');
        addVignette.className = 'addVignette';
        addVignette.innerHTML = '+';
        var self = this;
        addVignette.onclick = function() {
            gmDiv.removeChild(addVignette);
            
            var count = self.gmPoolArray.length + 1;
            var vignetteName = 'npc' + (count).toString();
            var vignetteCaption = language['npc'] + ' ' + count.toString()
            
            self.gmPoolArray.push({
                name: vignetteName,
                caption: vignetteCaption
            });
            
            self.storeGMArray();
            
            self.createGMPool(vignetteName, language, gmDiv, language['npc'] + ' ' + count.toString());
            self.createGMAdd(gmDiv, language);
        };
        
        gmDiv.appendChild(addVignette);
    },
    
    storeGMArray: function() {
        localStorage.setItem('gmPoolArray', JSON.stringify(this.gmPoolArray));
    }
};

function statPool() {
    this.create = function(tableDiv, name, caption) {
        this.caption = caption;
        this.poolDiv = document.createElement('div');
        this.poolDiv.setAttribute('id', name);
        this.name = name;
        this.poolDiv.className = 'pool';
        tableDiv.appendChild(this.poolDiv);
        
        var storedStat = localStorage.getItem(this.name);
        if (!storedStat) {
            this.stat = 10;
        } else {
            this.stat = storedStat;
        }
        
        this.minusDiv = document.createElement('div');
        this.minusDiv.className = 'minus button';
        this.minusDiv.innerHTML = '-';
        
        
        this.statContainerDiv = document.createElement('div');
        this.statContainerDiv.className = 'statContainer';
        
        this.poolTitle = document.createElement('div');
        this.poolTitle.className = 'poolTitle';
        this.poolTitle.innerHTML = this.caption;
        this.statContainerDiv.appendChild(this.poolTitle);
        
        this.statDiv = document.createElement('div');
        this.statDiv.className = 'stat';
        this.setStat();
        this.statContainerDiv.appendChild(this.statDiv);
        
        this.addDiv = document.createElement('div');
        this.addDiv.className = 'add button';
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
        localStorage.setItem(this.name, this.stat);
    };
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    url = url.toLowerCase(); // This is just to avoid case sensitiveness  
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

ready(function() {
    numenerapool.run();   
});