document.addEventListener('DOMContentLoaded', () => {
    // 拡大表示関連の要素を取得
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');


    // 全てのサムネイル画像の要素を取得
    const thumbnails = document.querySelectorAll('.photo-preview img');
    
    // 全ての画像のファイルパスを格納する配列
    // ユーザーのHTMLからパスがクリーンに取得されます
    const imageSources = Array.from(thumbnails).map(img => img.src);
    
    // 現在表示中の写真のインデックス
    let currentIndex = 0;

    // --- 画像のロード完了を待つPromise関数 ---
    // これにより、画像が表示できる状態になるまで待機します
    function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                // ロードが成功したら解決
                lightboxImage.src = url;
                resolve();
            };
            img.onerror = () => {
                // ロードが失敗したらエラーを出力
                console.error("画像ロード失敗: " + url);
                reject(new Error('Image failed to load: ' + url));
            };
            img.src = url;
        });
    }

    // --- 写真を表示する async 関数 ---
    async function showImage(index) {
        // 範囲外チェックとループ処理
        if (index < 0) {
            currentIndex = imageSources.length - 1; 
        } else if (index >= imageSources.length) {
            currentIndex = 0; 
        } else {
            currentIndex = index; 
        }
        
        const targetSrc = imageSources[currentIndex];
        
        // ★ 核心: 画像がロードされるまで処理を待機します ★
        try {
            await loadImage(targetSrc);
        } catch (error) {
            // ロード失敗時でも、lightboxは開いてエラーメッセージが表示される状態にする
            console.error("モーダル表示中にロードエラーが発生しました。", error);
            // エラー表示のため、とりあえずlightboxImage.srcをセットし、ブラウザのエラー画像を表示させる
            lightboxImage.src = targetSrc;
        }
    }


    // --- 拡大表示機能 ---
    thumbnails.forEach((img, index) => {
        img.addEventListener('click', async (e) => { // asyncを追加
            e.preventDefault(); 
            
            currentIndex = index; 

            // 画像のロード完了を待ってからモーダルを開く
            await showImage(currentIndex);
            
            // ロード完了後にモーダルを表示
            lightbox.classList.remove('hidden');
        });
    }); 
    
    // --- 写真送り/戻し機能 ---
    prevBtn.addEventListener('click', async (e) => { // asyncを追加
        e.preventDefault(); 
        await showImage(currentIndex - 1); // ロード完了を待つ
    });

    nextBtn.addEventListener('click', async (e) => { // asyncを追加
        e.preventDefault(); 
        await showImage(currentIndex + 1); // ロード完了を待つ
    });



    // --- 閉じる機能 ---
    closeBtn.addEventListener('click', () => {
        lightbox.classList.add('hidden');
    });

    // Escキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
            lightbox.classList.add('hidden');
        }
    });

    // モーダルの背景をクリックで閉じる
    lightbox.addEventListener('click', (e) => {
        // ボタンや画像自体をクリックした場合は閉じないようにする
        if (e.target.id === 'lightbox') {
            lightbox.classList.add('hidden');
        }
    });
});