document.addEventListener('DOMContentLoaded', () => {
    // Board Elements
    const boardForm = document.getElementById('board-submit');
    const boardCancel = document.getElementById('board-cancel');
    const boardList = document.getElementById('board-list');
    const nameInput = document.getElementById('board-name');
    const titleInput = document.getElementById('board-title');
    const contentInput = document.getElementById('board-content');
    const postIdInput = document.getElementById('post-id');
    const formTitle = document.getElementById('form-title');
    const totalPostsSpan = document.getElementById('total-posts');

    // Initial Data
    let posts = JSON.parse(localStorage.getItem('portfolio-posts') || '[]');

    function saveToStorage() {
        localStorage.setItem('portfolio-posts', JSON.stringify(posts));
        renderPosts();
    }

    function renderPosts() {
        boardList.innerHTML = '';
        totalPostsSpan.textContent = posts.length;

        posts.sort((a, b) => b.id - a.id).forEach(post => {
            const div = document.createElement('div');
            div.className = 'board-item';
            div.innerHTML = `
                <div class="post-header">
                    <div class="post-title">${post.title}</div>
                    <div class="post-info">${post.name} | ${post.date}</div>
                </div>
                <div class="post-content">${post.content}</div>
                <div class="post-actions">
                    <button class="action-btn" onclick="editPost(${post.id})">
                        <i class="fas fa-edit"></i> 수정
                    </button>
                    <button class="action-btn delete" onclick="deletePost(${post.id})">
                        <i class="fas fa-trash"></i> 삭제
                    </button>
                </div>
            `;
            boardList.appendChild(div);
        });
    }

    // Global action functions
    window.deletePost = (id) => {
        if(confirm('정말 삭제하시겠습니까?')) {
            posts = posts.filter(p => p.id !== id);
            saveToStorage();
        }
    };

    window.editPost = (id) => {
        const post = posts.find(p => p.id === id);
        if(post) {
            postIdInput.value = post.id;
            nameInput.value = post.name;
            titleInput.value = post.title;
            contentInput.value = post.content;
            
            formTitle.textContent = '글 수정하기';
            boardForm.textContent = '수정 완료';
            boardCancel.style.display = 'block';
            
            document.getElementById('board-form-wrapper').scrollIntoView({ behavior: 'smooth' });
        }
    };

    boardCancel.addEventListener('click', resetForm);

    function resetForm() {
        postIdInput.value = '';
        nameInput.value = '';
        titleInput.value = '';
        contentInput.value = '';
        formTitle.textContent = '새 글 쓰기';
        boardForm.textContent = '등록하기';
        boardCancel.style.display = 'none';
    }

    boardForm.addEventListener('click', () => {
        const id = postIdInput.value;
        const name = nameInput.value.trim();
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const date = new Date().toLocaleDateString();

        if (name && title && content) {
            if(id) {
                // Update
                const index = posts.findIndex(p => p.id == id);
                posts[index] = { ...posts[index], name, title, content };
                alert('글이 수정되었습니다.');
            } else {
                // Create
                const newPost = {
                    id: Date.now(),
                    name,
                    title,
                    content,
                    date
                };
                posts.push(newPost);
                alert('글이 등록되었습니다.');
            }
            
            saveToStorage();
            resetForm();
        } else {
            alert('모든 필드를 입력해주세요.');
        }
    });

    renderPosts();

    // Navigation & Scroll Logic
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
});
