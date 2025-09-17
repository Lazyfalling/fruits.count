class FruitCountingGame {
    constructor() {
        this.fruitContainer = document.getElementById('fruitContainer');
        this.startBtn = document.getElementById('startBtn');
        this.arrangeBtn = document.getElementById('arrangeBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.appleBtn = document.getElementById('appleBtn');
        this.peachBtn = document.getElementById('peachBtn');
        this.orangeBtn = document.getElementById('orangeBtn');
        this.counterElement = document.getElementById('selectedCount');
        
        this.selectedCount = 0;
        this.currentSelection = null;
        this.fruits = [];
        
        this.fruitIcons = {
            apple: '🍎',
            peach: '🍑',
            orange: '🍊'
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        console.log('游戏初始化完成');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.arrangeBtn.addEventListener('click', () => this.arrangeFruits());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        
        this.appleBtn.addEventListener('click', () => this.setSelectionType('apple'));
        this.peachBtn.addEventListener('click', () => this.setSelectionType('peach'));
        this.orangeBtn.addEventListener('click', () => this.setSelectionType('orange'));
    }

    startGame() {
        console.log('开始游戏');
        
        // 显示游戏元素
        this.fruitContainer.classList.remove('hidden');
        this.arrangeBtn.classList.remove('hidden');
        this.resetBtn.classList.remove('hidden');
        
        // 隐藏开始按钮
        this.startBtn.classList.add('hidden');
        
        // 生成水果
        this.generateFruits();
    }

    generateFruits() {
        this.fruitContainer.innerHTML = '';
        this.selectedCount = 0;
        this.updateCounter();
        this.fruits = [];
        
        const fruitTypes = ['apple', 'peach', 'orange'];
        
        fruitTypes.forEach(type => {
            // 每种水果生成5-10个
            const count = Math.floor(Math.random() * 6) + 5;
            console.log(`生成${type}水果: ${count}个`);
            
            for (let i = 0; i < count; i++) {
                this.createFruit(type);
            }
        });
        
        console.log('水果生成完成，总计:', this.fruits.length, '个水果');
    }

    createFruit(type) {
        const fruit = document.createElement('div');
        fruit.className = `fruit ${type}`;
        fruit.dataset.type = type;
        
        // 更换桃子图标
        const icon = type === 'peach' ? '🍑' : this.fruitIcons[type];
        fruit.innerHTML = icon;
        
        const position = this.getRandomPosition();
        fruit.style.left = position.x + 'px';
        fruit.style.top = position.y + 'px';
        
        fruit.addEventListener('click', () => this.toggleSelection(fruit));
        
        this.fruitContainer.appendChild(fruit);
        this.fruits.push(fruit);
    }

    getRandomPosition() {
        const containerWidth = this.fruitContainer.offsetWidth;
        const containerHeight = this.fruitContainer.offsetHeight;
        const fruitSize = 60;
        
        let x, y;
        let attempts = 0;
        const maxAttempts = 100;
        
        // 确保水果不重叠
        do {
            x = Math.floor(Math.random() * (containerWidth - fruitSize));
            y = Math.floor(Math.random() * (containerHeight - fruitSize));
            attempts++;
            
            if (attempts >= maxAttempts) {
                console.log('达到最大尝试次数，可能无法避免重叠');
                break;
            }
            
        } while (this.isOverlapping(x, y, fruitSize));
        
        return { x, y };
    }

    isOverlapping(x, y, size) {
        const padding = 5; // 额外间距
        
        for (const fruit of this.fruits) {
            const fruitX = parseInt(fruit.style.left);
            const fruitY = parseInt(fruit.style.top);
            
            // 检查是否重叠
            if (Math.abs(x - fruitX) < size + padding && 
                Math.abs(y - fruitY) < size + padding) {
                return true;
            }
        }
        
        return false;
    }

    setSelectionType(type) {
        this.currentSelection = type;
        console.log('当前选择类型:', type);
        
        // 更新按钮状态
        this.clearSelectionButtons();
        
        const activeBtn = this[type + 'Btn'];
        activeBtn.classList.add('btn-active');
    }

    clearSelectionButtons() {
        this.appleBtn.classList.remove('btn-active');
        this.peachBtn.classList.remove('btn-active');
        this.orangeBtn.classList.remove('btn-active');
    }

    toggleSelection(fruit) {
        if (!this.currentSelection) {
            console.log('请先选择水果类型');
            return;
        }
        
        const fruitType = fruit.dataset.type;
        
        // 检查是否匹配当前选择类型
        if (fruitType !== this.currentSelection) {
            console.log('类型不匹配，当前选择:', this.currentSelection, '水果类型:', fruitType);
            return;
        }
        
        if (fruit.classList.contains('selected')) {
            // 取消选择
            fruit.classList.remove('selected');
            this.selectedCount--;
        } else {
            // 选择
            fruit.classList.add('selected');
            this.selectedCount++;
        }
        
        this.updateCounter();
        console.log('当前选择数量:', this.selectedCount);
    }

    updateCounter() {
        this.counterElement.textContent = this.selectedCount;
    }

    arrangeFruits() {
        console.log('排列水果');
        
        const containerWidth = this.fruitContainer.offsetWidth;
        const containerHeight = this.fruitContainer.offsetHeight;
        
        // 按类型分组
        const apples = this.fruits.filter(f => f.dataset.type === 'apple');
        const peaches = this.fruits.filter(f => f.dataset.type === 'peach');
        const oranges = this.fruits.filter(f => f.dataset.type === 'orange');
        
        console.log('分组结果 - 苹果:', apples.length, '桃子:', peaches.length, '橙子:', oranges.length);
        
        // 设置每个堆的位置
        this.arrangeFruitGroup(apples, 0, containerWidth / 3, containerHeight);
        this.arrangeFruitGroup(peaches, containerWidth / 3, containerWidth / 3, containerHeight);
        this.arrangeFruitGroup(oranges, 2 * containerWidth / 3, containerWidth / 3, containerHeight);
    }

    arrangeFruitGroup(fruits, startX, groupWidth, containerHeight) {
        const rows = 5;
        const cols = Math.ceil(fruits.length / rows);
        const fruitSize = 60;
        const spacing = 10;
        
        fruits.forEach((fruit, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            
            const x = startX + col * (fruitSize + spacing);
            const y = row * (fruitSize + spacing);
            
            // 确保不超出容器
            const maxX = startX + groupWidth - fruitSize;
            const maxY = containerHeight - fruitSize;
            
            fruit.style.left = Math.min(x, maxX) + 'px';
            fruit.style.top = Math.min(y, maxY) + 'px';
            
            fruit.style.transition = 'all 0.5s ease';
        });
    }

    resetGame() {
        console.log('重新生成水果');
        
        // 清空水果
        this.fruitContainer.innerHTML = '';
        this.fruits = [];
        
        // 重置计数
        this.selectedCount = 0;
        this.updateCounter();
        
        // 重置选择状态
        this.currentSelection = null;
        this.clearSelectionButtons();
        
        // 重新生成水果
        this.generateFruits();
        
        console.log('水果已重新生成');
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new FruitCountingGame();
});