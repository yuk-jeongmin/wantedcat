import { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { InlineSearch } from './InlineSearch';
import { PostTable } from './PostTable';
import { PostDetail } from './PostDetail';
import { CreatePostForm } from './CreatePostForm';
import type { Post } from './PostCard';
import { listPosts, getPost, createPost, updatePost, deletePost } from '@/api/posts';
import { useDebounce } from '../hooks/useDebounce';

export default function PostsBoard() {
  // 로그인 붙기 전 임시 사용자
  const [currentUser] = useState<{ username: string; role: string } | null>({
    username: '김집사',
    role: 'user',
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultsCount, setResultsCount] = useState(0);

  // 검색 상태
  const [searchTerm, setSearchTerm] = useState('');
  const dq = useDebounce(searchTerm, 300); // 300ms 디바운스

  // 작성/수정 모달
  const [openForm, setOpenForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // 상세 모달
  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState<Post | null>(null);

  // 목록 조회 (q 반영)
  const fetchList = async () => {
    setLoading(true);
    try {
      const page = await listPosts({ page: 0, size: 20, q: dq || undefined });
      setPosts(page.content);
      setResultsCount(page.totalElements);
    } finally {
      setLoading(false);
    }
  };

  // 최초 + 검색어 변경 시 재조회
  useEffect(() => { fetchList(); }, [dq]);

  const handleRowClick = async (post: Post) => {
    try {
      const fresh = await getPost(post.id);
      setSelected(fresh);
      setOpenDetail(true);
    } catch {
      alert('게시글을 불러오지 못했습니다.');
    }
  };

  const handleOpenCreate = () => { setEditingPost(null); setOpenForm(true); };
  const handleEdit = (post: Post) => { setEditingPost(post); setOpenForm(true); };

  const handleDelete = async (postId: number) => {
    const target = posts.find(p => p.id === postId);
    if (!target) return;
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deletePost(postId, target.author); // 백엔드: author 필요
      await fetchList();
      if (openDetail && selected?.id === postId) {
        setOpenDetail(false);
        setSelected(null);
      }
    } catch {
      alert('삭제 실패(작성자 일치 필요)');
    }
  };

  const handleSubmit = async (payload: Omit<Post,'id'|'views'|'likes'|'comments'|'createdAt'>) => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, { author: payload.author, ...payload });
      } else {
        await createPost(payload);
      }
      await fetchList();
    } catch {
      alert('저장 실패');
    }
  };

  const canEditSelected  = useMemo(() => !!(selected && currentUser?.username === selected.author), [selected, currentUser]);
  const canDeleteSelected = useMemo(() => !!(selected && (currentUser?.username === selected.author || currentUser?.role === 'admin')), [selected, currentUser]);

  return (
    <div className="space-y-4">
      {/* 상단: 제목 + 새 글 버튼 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">게시판</h2>
        <Button onClick={handleOpenCreate}>새 글 작성</Button>
      </div>

      {/* 검색 바 (InlineSearch 컴포넌트 사용) */}
      <InlineSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        resultsCount={resultsCount}
      />

      {/* 목록 */}
      <PostTable
        posts={posts}
        onPostClick={handleRowClick}
        currentUser={currentUser}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* 작성/수정 모달 */}
      {openForm && (
        <CreatePostForm
          editingPost={editingPost}
          onClose={() => setOpenForm(false)}
          onSubmit={handleSubmit}
        />
      )}

      {/* 상세 모달 */}
      {openDetail && selected && (
        <PostDetail
          item={selected}
          onBack={() => { setOpenDetail(false); setSelected(null); }}
          canEdit={canEditSelected}
          canDelete={canDeleteSelected}
          onEdit={() => { setOpenDetail(false); handleEdit(selected); }}
          onDelete={() => { handleDelete(selected.id); }}
        />
      )}
    </div>
  );
}
