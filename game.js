// 水果数数游戏 - Canvas版本
class FruitCountingGame {
    constructor() {
        // 获取DOM元素
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.appleBtn = document.getElementById('appleBtn');
        this.orangeBtn = document.getElementById('orangeBtn');
        this.peachBtn = document.getElementById('peachBtn');
        this.arrangeBtn = document.getElementById('arrangeBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.submitBtn = document.getElementById('submitBtn');
        this.counterElement = document.getElementById('selectedCount');
        
        // 答题输入框
        this.appleAnswer = document.getElementById('appleAnswer');
        this.orangeAnswer = document.getElementById('orangeAnswer');
        this.peachAnswer = document.getElementById('peachAnswer');
        
        // 数字键盘
        this.numberPad = document.getElementById('numberPad');
        this.currentNumberDisplay = document.getElementById('currentNumber');
        this.deleteBtn = document.getElementById('deleteBtn');
        this.confirmBtn = document.getElementById('confirmBtn');
        
        // 结果模态框
        this.resultModal = document.getElementById('resultModal');
        this.resultTitle = document.getElementById('resultTitle');
        this.resultMessage = document.getElementById('resultMessage');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        
        // 游戏状态
        this.currentSelection = null;
        this.selectedCount = 0;
        this.fruits = [];
        this.fruitCounts = { apple: 0, orange: 0, peach: 0 };
        this.selectedFruits = { apple: 0, orange: 0, peach: 0 };
        this.currentInput = null;
        this.currentNumber = '0';
        
        // 水果图标
        this.fruitIcons = {
            apple: '🍎',
            orange: '🍊', 
            peach: '🍑'
        };
        
        // 水果颜色
        this.fruitColors = {
            apple: '#ff6b6b',
            orange: '#ff9a3c',
            peach: '#ff6b9d'
        };
        
        // 水果高亮颜色
        this.highlightColors = {
            apple: '#ff4757',
            orange: '#ff7f50',
            peach: '#ff69b4'
        };
        
        this.init();
    }

    init() {
        // 设置画布尺寸
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 绑定事件
        this.bindEvents();
        
        // 开始游戏
        this.startGame();
    }

    // 绑定事件监听器
    bindEvents() {
        // 水果选择按钮
        this.appleBtn.addEventListener('click', () => this.setSelectionType('apple'));
        this.orangeBtn.addEventListener('click', () => this.setSelectionType('orange'));
        this.peachBtn.addEventListener('click', () => this.setSelectionType('peach'));
        
        // 控制按钮
        this.arrangeBtn.addEventListener('click', () => this.arrangeFruits());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.submitBtn.addEventListener('click', () => this.submitAnswers());
        
        // 画布点击
        this.canvas.addEventListener('click', (event) => this.handleCanvasClick(event));
        
        // 答案输入框
        this.appleAnswer.addEventListener('click', () => this.showNumberPad('apple'));
        this.orangeAnswer.addEventListener('click', () => this.showNumberPad('orange'));
        this.peachAnswer.addEventListener('click', () => this.showNumberPad('peach'));
        
        // 数字键盘
        document.querySelectorAll('.num-btn').forEach(btn => {
            btn.addEventListener('click', () => this.addNumber(btn.dataset.num));
        });
        this.deleteBtn.addEventListener('click', () => this.deleteNumber());
        this.confirmBtn.addEventListener('click', () => this.confirmNumber());
        
        // 结果模态框
        this.playAgainBtn.addEventListener('click', () => {
            this.resultModal.classList.add('hidden');
            this.resetGame();
        });
    }

    // 调整画布尺寸
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        
        // 重新渲染
        if (this.fruits.length > 0) {
            this.render();
        }
    }

    // 开始游戏
    startGame() {
        this.fruits = [];
        
        // 每种水果都是5~10个
        const appleCount = Math.floor(Math.random() * 6) + 5; // 5-10个
        const orangeCount = Math.floor(Math.random() * 6) + 5; // 5-10个
        const peachCount = Math.floor(Math.random() * 6) + 5; // 5-10个
        
        // 记录水果数量
        this.fruitCounts = { apple: appleCount, orange: orangeCount, peach: peachCount };
        
        // 生成水果
        for (let i = 0; i < appleCount; i++) {
            this.fruits.push(this.createFruit('apple'));
        }
        for (let i = 0; i < orangeCount; i++) {
            this.fruits.push(this.createFruit('orange'));
        }
        for (let i = 0; i < peachCount; i++) {
            this.fruits.push(this.createFruit('peach'));
        }
        
        this.render();
    }

    // 创建水果
    createFruit(type) {
        const position = this.getRandomPosition();
        return {
            type: type,
            x: position.x,
            y: position.y,
            radius: 25,
            selected: false,
            highlight: false
        };
    }

    // 获取随机位置，确保不重叠
    getRandomPosition() {
        const padding = 30;
        const maxX = this.canvas.width - 50;
        const maxY = this.canvas.height - 50;
        
        let x, y;
        let attempts = 0;
        const maxAttempts = 100;
        
        do {
            x = Math.random() * (maxX - padding * 2) + padding;
            y = Math.random() * (maxY - padding * 2) + padding;
            attempts++;
        } while (this.isOverlapping(x, y, 25) && attempts < maxAttempts);
        
        return { x, y };
    }

    // 检查是否重叠
    isOverlapping(x, y, radius) {
        for (const fruit of this.fruits) {
            const dx = fruit.x - x;
            const dy = fruit.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < radius * 2 + 10) { // 10px间距
                return true;
            }
        }
        return false;
    }

    // 处理画布点击
    handleCanvasClick(event) {
        if (!this.currentSelection) {
            console.log('请先选择水果类型');
            this.playErrorSound();
            return;
        }
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // 检查点击是否在水果上
        for (let i = this.fruits.length - 1; i >= 0; i--) {
            const fruit = this.fruits[i];
            const dx = fruit.x - mouseX;
            const dy = fruit.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= fruit.radius) {
                this.toggleSelection(fruit);
                return;
            }
        }
    }

    // 设置选择类型
    setSelectionType(type) {
        this.currentSelection = type;
        
        // 更新按钮状态
        this.appleBtn.classList.remove('active');
        this.orangeBtn.classList.remove('active');
        this.peachBtn.classList.remove('active');
        
        this[type + 'Btn'].classList.add('active');
        
        // 不设置高亮效果，只有在点击水果时才显示选中状态
        this.render();
        console.log('选择类型:', type);
    }

    // 切换选择状态
    toggleSelection(fruit) {
        if (fruit.type !== this.currentSelection) {
            console.log('类型不匹配');
            this.playErrorSound();
            return;
        }
        
        this.playClickSound();
        
        if (fruit.selected) {
            // 取消选择
            fruit.selected = false;
            this.selectedFruits[fruit.type]--;
            this.selectedCount--;
            console.log('取消选择', fruit.type, '当前selected:', fruit.selected);
        } else {
            // 选择 - 播放水果选择成功音效
            this.playFruitSelectSound();
            fruit.selected = true;
            this.selectedFruits[fruit.type]++;
            this.selectedCount++;
            console.log('选择', fruit.type, '当前selected:', fruit.selected);
        }
        
        this.updateCounter();
        this.render();
        console.log('当前选择:', this.selectedFruits);
    }

    // 排列水果
    arrangeFruits() {
        console.log('排列水果');
        
        const padding = 30;
        const spacing = 60; // 增加间距确保不重叠
        const columns = 3;
        const colWidth = (this.canvas.width - padding * 2) / columns;
        
        // 按类型分组
        const apples = this.fruits.filter(f => f.type === 'apple');
        const oranges = this.fruits.filter(f => f.type === 'orange');
        const peaches = this.fruits.filter(f => f.type === 'peach');
        
        // 排列苹果（第一列）
        this.arrangeFruitGroup(apples, padding + colWidth * 0, colWidth, padding);
        
        // 排列橘子（第二列）
        this.arrangeFruitGroup(oranges, padding + colWidth * 1, colWidth, padding);
        
        // 排列桃子（第三列）
        this.arrangeFruitGroup(peaches, padding + colWidth * 2, colWidth, padding);
        
        this.playArrangeSound();
        this.render();
    }

    // 排列水果组
    arrangeFruitGroup(fruits, startX, groupWidth, startY) {
        const fruitSize = 50; // 水果直径
        const rowSpacing = 60; // 行间距
        const colSpacing = 60; // 列间距
        const maxCols = 2; // 每行固定排2个水果
        
        fruits.forEach((fruit, index) => {
            const row = Math.floor(index / maxCols);
            const col = index % maxCols;
            
            fruit.x = startX + col * colSpacing + colSpacing / 2;
            fruit.y = startY + row * rowSpacing + rowSpacing / 2;
            
            // 确保不超出容器边界
            fruit.x = Math.max(fruit.x, fruit.radius);
            fruit.x = Math.min(fruit.x, this.canvas.width - fruit.radius);
            fruit.y = Math.max(fruit.y, fruit.radius);
            fruit.y = Math.min(fruit.y, this.canvas.height - fruit.radius);
        });
    }

    // 渲染画布
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景
        this.ctx.fillStyle = '#fffaf0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制水果
        this.fruits.forEach(fruit => {
            this.drawFruit(fruit);
        });
    }

    // 绘制水果
    drawFruit(fruit) {
        console.log('绘制水果:', fruit.type, '选中状态:', fruit.selected);
        
        // 绘制水果背景（奶白色）
        this.ctx.fillStyle = '#fffaf0';
        this.ctx.beginPath();
        this.ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制水果外圈
        this.ctx.beginPath();
        this.ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = fruit.highlight ? this.highlightColors[fruit.type] : '#ddd';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // 绘制选中状态
        if (fruit.selected) {
            // 创建新路径
            this.ctx.beginPath();
            this.ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = this.fruitColors[fruit.type];
            this.ctx.lineWidth = 4;
            this.ctx.stroke();
            
            // 选中光环效果
            this.ctx.beginPath();
            this.ctx.arc(fruit.x, fruit.y, fruit.radius + 5, 0, Math.PI * 2);
            this.ctx.strokeStyle = this.fruitColors[fruit.type] + '80';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
        
        // 绘制水果图标
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#333';
        this.ctx.fillText(this.fruitIcons[fruit.type], fruit.x, fruit.y);
    }

    // 更新计数器
    updateCounter() {
        if (this.counterElement) {
            this.counterElement.textContent = this.selectedCount;
        }
    }

    // 显示数字键盘
    showNumberPad(fruitType) {
        this.currentInput = fruitType;
        this.currentNumber = this[fruitType + 'Answer'].value || '0';
        this.currentNumberDisplay.textContent = this.currentNumber;
        this.numberPad.classList.remove('hidden');
    }

    // 添加数字
    addNumber(number) {
        if (this.currentNumber === '0') {
            this.currentNumber = number;
        } else if (this.currentNumber.length < 2) {
            this.currentNumber += number;
        }
        this.currentNumberDisplay.textContent = this.currentNumber;
    }

    // 删除数字
    deleteNumber() {
        if (this.currentNumber.length > 1) {
            this.currentNumber = this.currentNumber.slice(0, -1);
        } else {
            this.currentNumber = '0';
        }
        this.currentNumberDisplay.textContent = this.currentNumber;
    }

    // 确认数字
    confirmNumber() {
        if (this.currentInput) {
            this[this.currentInput + 'Answer'].value = this.currentNumber === '0' ? '' : this.currentNumber;
            this.currentInput = null;
        }
        this.numberPad.classList.add('hidden');
        this.currentNumber = '0';
    }

    // 提交答案
    submitAnswers() {
        const answers = {
            apple: parseInt(this.appleAnswer.value) || 0,
            orange: parseInt(this.orangeAnswer.value) || 0,
            peach: parseInt(this.peachAnswer.value) || 0
        };
        
        const correct = {
            apple: answers.apple === this.fruitCounts.apple,
            orange: answers.orange === this.fruitCounts.orange,
            peach: answers.peach === this.fruitCounts.peach
        };
        
        const allCorrect = correct.apple && correct.orange && correct.peach;
        
        if (allCorrect) {
            // 全部正确
            this.showSuccessResult();
            this.playFireworks();
        } else {
            // 有错误
            this.showErrorResult(correct);
            this.playErrorSound();
        }
    }

    // 显示成功结果
    showSuccessResult() {
        this.resultTitle.textContent = '🎉 太棒了！';
        this.resultMessage.textContent = '你全部答对了！真是个数学小天才！';
        this.playAgainBtn.style.display = 'block';
        this.resultModal.classList.remove('hidden');
        this.playSuccessSound(); // 播放胜利音效
        this.playFireworks();
    }

    // 显示错误结果
    showErrorResult(correct) {
        this.resultTitle.textContent = '🤔 再试试看';
        this.resultMessage.textContent = '有些答案不太对哦，检查一下再提交吧！';
        this.playAgainBtn.style.display = 'none'; // 隐藏再来一次按钮
        this.resultModal.classList.remove('hidden');
        this.playFailSound(); // 播放失败音效
        
        // 标记错误答案
        if (!correct.apple) this.appleAnswer.classList.add('error');
        if (!correct.orange) this.orangeAnswer.classList.add('error');
        if (!correct.peach) this.peachAnswer.classList.add('error');
        
        // 1秒后自动关闭错误提示
        setTimeout(() => {
            this.resultModal.classList.add('hidden');
        }, 1000);
    }

    // 重置游戏
    resetGame() {
        console.log('重新开始游戏');
        
        // 重置状态
        this.currentSelection = null;
        this.selectedCount = 0;
        this.selectedFruits = { apple: 0, orange: 0, peach: 0 };
        
        // 清除答案
        this.appleAnswer.value = '';
        this.orangeAnswer.value = '';
        this.peachAnswer.value = '';
        this.appleAnswer.classList.remove('error');
        this.orangeAnswer.classList.remove('error');
        this.peachAnswer.classList.remove('error');
        
        // 重置按钮状态
        this.appleBtn.classList.remove('active');
        this.orangeBtn.classList.remove('active');
        this.peachBtn.classList.remove('active');
        
        // 隐藏模态框
        this.resultModal.classList.add('hidden');
        
        // 重新开始游戏
        this.startGame();
    }

    // 音效方法
    playClickSound() {
        if (window.soundManager) {
            window.soundManager.playClickSound();
        }
    }

    playFruitSelectSound() {
        if (window.soundManager) {
            window.soundManager.playFruitSelectSound();
        }
    }

    playErrorSound() {
        if (window.soundManager) {
            window.soundManager.playErrorSound();
        }
    }

    playGameStartSound() {
        if (window.soundManager) {
            window.soundManager.playGameStartSound();
        }
    }

    playArrangeSound() {
        if (window.soundManager) {
            window.soundManager.playArrangeSound();
        }
    }

    playFireworks() {
        if (window.fireworks) {
            window.fireworks.start();
            setTimeout(() => window.fireworks.stop(), 3000);
        }
    }

    playSuccessSound() {
        if (window.soundManager) {
            window.soundManager.playSuccessSound();
        }
    }
    
    playFailSound() {
        if (window.soundManager) {
            window.soundManager.playFailSound();
        }
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new FruitCountingGame();
});