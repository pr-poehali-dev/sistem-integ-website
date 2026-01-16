import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContent, saveContent, resetContent, type SiteContent } from '@/lib/content-manager';
import { initUsers, isAuthenticated, logoutUser, getCurrentUser, changePassword as changeUserPassword } from '@/lib/user-manager';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminContentEditor from '@/components/admin/AdminContentEditor';
import ImageManager from '@/components/admin/ImageManager';
import UserManager from '@/components/admin/UserManager';
import ProjectManager from '@/components/admin/ProjectManager';
import LegalEntityManager from '@/components/admin/LegalEntityManager';
import PersonManager from '@/components/admin/PersonManager';
import UnitManager from '@/components/admin/UnitManager';
import BankManager from '@/components/admin/BankManager';
import MaterialManager from '@/components/admin/MaterialManager';
import PasswordChangeModal from '@/components/admin/PasswordChangeModal';

export default function Admin() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{id: string; name: string; role: string} | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'solutions' | 'advantages' | 'portfolio' | 'certificates' | 'contact' | 'images' | 'users' | 'projects' | 'legal-entities' | 'persons' | 'units' | 'banks' | 'materials'>('images');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    initUsers();
    if (isAuthenticated()) {
      const user = getCurrentUser();
      if (user) {
        setAuthenticated(true);
        setCurrentUser(user);
        setContent(getContent());
      }
    }
  }, []);

  const handleLoginSuccess = (userId: string, userName: string, userRole: string) => {
    setAuthenticated(true);
    setCurrentUser({ id: userId, name: userName, role: userRole });
    setContent(getContent());
  };

  const handleLogout = () => {
    logoutUser();
    setAuthenticated(false);
    setCurrentUser(null);
    navigate('/');
  };

  const handleSave = () => {
    if (content) {
      saveContent(content);
      alert('Изменения сохранены!');
    }
  };

  const handlePasswordChange = () => {
    if (currentUser && changeUserPassword(currentUser.id, oldPassword, newPassword)) {
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

  if (!authenticated) {
    return (
      <AdminLogin onLoginSuccess={handleLoginSuccess} />
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
        userName={currentUser?.name}
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
            {activeTab === 'images' ? (
              <ImageManager />
            ) : activeTab === 'users' && currentUser?.role === 'admin' ? (
              <UserManager />
            ) : activeTab === 'users' ? (
              <div className="text-center py-12 text-muted-foreground">
                Доступ запрещен. Только администраторы могут управлять пользователями.
              </div>
            ) : activeTab === 'projects' && currentUser?.role === 'admin' ? (
              <ProjectManager />
            ) : activeTab === 'projects' ? (
              <div className="text-center py-12 text-muted-foreground">
                Доступ запрещен. Только администраторы могут управлять проектами.
              </div>
            ) : activeTab === 'legal-entities' && currentUser?.role === 'admin' ? (
              <LegalEntityManager />
            ) : activeTab === 'legal-entities' ? (
              <div className="text-center py-12 text-muted-foreground">
                Доступ запрещен. Только администраторы могут управлять юрлицами.
              </div>
            ) : activeTab === 'persons' && currentUser?.role === 'admin' ? (
              <PersonManager />
            ) : activeTab === 'persons' ? (
              <div className="text-center py-12 text-muted-foreground">
                Доступ запрещен. Только администраторы могут управлять физлицами.
              </div>
            ) : activeTab === 'units' && currentUser?.role === 'admin' ? (
              <UnitManager />
            ) : activeTab === 'units' ? (
              <div className="text-center py-12 text-muted-foreground">
                Доступ запрещен. Только администраторы могут управлять единицами измерения.
              </div>
            ) : activeTab === 'banks' && currentUser?.role === 'admin' ? (
              <BankManager />
            ) : activeTab === 'banks' ? (
              <div className="text-center py-12 text-muted-foreground">
                Доступ запрещен. Только администраторы могут управлять банками.
              </div>
            ) : activeTab === 'materials' && currentUser?.role === 'admin' ? (
              <MaterialManager />
            ) : activeTab === 'materials' ? (
              <div className="text-center py-12 text-muted-foreground">
                Доступ запрещен. Только администраторы могут управлять материалами и оборудованием.
              </div>
            ) : (
              <AdminContentEditor
                activeTab={activeTab}
                content={content}
                onContentChange={setContent}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}