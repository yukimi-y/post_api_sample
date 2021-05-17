// Rails API 側の ベースURL
const baseURL = 'http://localhost:3000';
// 投稿リストの DOM 要素オブジェクトを取得
const postList = document.getElementById('post-list');

// Rails の API から投稿一覧データを取得する関数
const fetchPosts = async () => {
  // ローカルの Rails サーバーの URL
  const url = `${baseURL}/posts`;
  const response = await fetch(url);

  // レスポンスが 200 OK 以外ならエラーを発生
  if (!response.ok) {
    throw new Error(`${response.status} (${response.statusText})`);
  }

  // レスポンスが 200 OK なら JSON を抽出
  const posts = await response.json();
  return posts;
};

// 投稿データを投稿リストに反映する関数
const addPost = (post) => {
  const content = `
  <div id="posts-${post.id}">
    <p>タイトル: ${post.title}</p>
    <p>内容: ${post.content}</p>
  </div>
  `;
  postList.insertAdjacentHTML('beforeend', content);
};

// Rails の API から投稿一覧データを取得してページに表示する関数
const displayPosts = async () => {
  try {
    // 投稿一覧データを取得
    const posts = await fetchPosts();
    // 各投稿を投稿リストに追加
    posts.forEach((post) => addPost(post));
  } catch (e) {
    alert(e);
  }
};

// 投稿ボタンの DOM 要素オブジェクトを取得
const postButton = document.getElementById('post-button');
// タイトル入力フィールドの DOM 要素オブジェクトを取得
const titleElement = document.getElementById('post-title');
// 内容入力エリアの DOM 要素オブジェクトを取得
const contentElement = document.getElementById('post-content');

// 入力内容をAPI側のサーバーに送信して保存する関数
const registerPost = async () => {
  // ローカルの Rails サーバーの posts#create に対応するURL
  const url = `${baseURL}/posts`;
  // 入力内容をAPI側が受け取れるパラメータ形式に加工
  const postParams = {
    post: {
      title: titleElement.value,
      content: contentElement.value,
    },
  };

  // API側のサーバーに送信
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postParams),
  });

  if (!response.ok) {
    throw new Error(`${response.status} (${response.statusText})`);
  }

  const post = await response.json();
  return post;
};

// フォームを送信し，入力内容を消去する関数
const postForm = async () => {
  try {
    // 入力内容をAPI側のサーバーに送信
    const post = await registerPost();
    // 入力内容を投稿リストに追加
    addPost(post);
    // 入力内容を消去
    titleElement.value = contentElement.value = '';
  } catch (e) {
    alert(e);
  }
};

// ボタンをクリックしたときにフォームを送信
postButton.addEventListener('click', postForm);

// 起動時に投稿一覧表示
displayPosts();