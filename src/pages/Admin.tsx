import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContent, saveContent, checkPassword, changePassword, resetContent, type SiteContent } from '@/lib/content-manager';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminContentEditor from '@/components/admin/AdminContentEditor';
import PasswordChangeModal from '@/components/admin/PasswordChangeModal';

export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'solutions' | 'advantages' | 'portfolio' | 'certificates' | 'contact'>('hero');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      setContent(getContent());
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkPassword(password)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setContent(getContent());
      setError('');
    } else {
      setError('Неверный пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    navigate('/');
  };

  const handleSave = () => {
    if (content) {
      saveContent(content);
      alert('Изменения сохранены!');
    }
  };

  const handlePasswordChange = () => {
    if (changePassword(oldPassword, newPassword)) {
      alert('Пароль успешно изменен!');
      setShowPasswordChange(false);
      setOldPassword('');
      setNewPassword('');
    } else {
      alert('Неверный текущий пароль');
    }
  };

  const handleReset = () => {
    if (confirm('Вы уверены? Все изменения будут потеряны.')) {
      resetContent();
      setContent(getContent());
      alert('Контент сброшен к начальному состоянию');
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        password={password}
        error={error}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
      />
    );
  }

  if (!content) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        onPasswordChange={() => setShowPasswordChange(true)}
        onReset={handleReset}
        onPreview={() => navigate('/')}
        onSave={handleSave}
        onLogout={handleLogout}
      />

      {showPasswordChange && (
        <PasswordChangeModal
          oldPassword={oldPassword}
          newPassword={newPassword}
          onOldPasswordChange={setOldPassword}
          onNewPasswordChange={setNewPassword}
          onSubmit={handlePasswordChange}
          onCancel={() => setShowPasswordChange(false)}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="lg:col-span-3">
            <AdminContentEditor
              activeTab={activeTab}
              content={content}
              onContentChange={setContent}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
