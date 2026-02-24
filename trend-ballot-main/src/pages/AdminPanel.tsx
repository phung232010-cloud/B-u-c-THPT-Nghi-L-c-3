import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, RotateCcw, Users, Vote, BarChart3, Shield, ImagePlus, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/AppLayout';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';

export default function AdminPanel() {
  const { 
    candidates, 
    logs, 
    resetVotes, 
    addCandidate, 
    deleteCandidate, 
    user,
    createAdminKey 
  } = useAppStore();

  const { toast } = useToast();

  const [showReset, setShowReset] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalVotes = candidates.reduce((s, c) => s + c.voteCount, 0);
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setNewImageUrl(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCandidate(newName, newDesc, newImageUrl);
    setShowAdd(false);
    setNewName('');
    setNewDesc('');
    setNewImageUrl('');
    setImagePreview('');
    toast({ title: 'Đã thêm ứng viên mới' });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteCandidate(deleteId);
      setDeleteId(null);
      toast({ title: 'Đã xóa ứng viên' });
    }
  };

  const handleReset = () => {
    resetVotes();
    setShowReset(false);
    toast({ title: 'Đã reset tất cả phiếu bầu' });
  };

  const handleCreateKey = () => {
    const key = createAdminKey();
    setGeneratedKey(key);
    toast({ title: 'Đã tạo Admin Key mới' });
  };

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="p-6 md:p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="glass rounded-2xl p-8 text-center">
            <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Truy cập bị từ chối</h2>
            <p className="text-muted-foreground">Bạn cần quyền Admin để truy cập trang này.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">Quản lý hệ thống bỏ phiếu</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowReset(true)} className="border-destructive/50 text-destructive hover:bg-destructive/10">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset Votes
            </Button>
            <Button size="sm" className="gradient-primary border-0 text-primary-foreground" onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4 mr-2" /> Thêm ứng viên
            </Button>
          </div>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[ 
            { icon: Users, label: 'Ứng viên', value: candidates.length },
            { icon: Vote, label: 'Tổng phiếu', value: totalVotes },
            { icon: BarChart3, label: 'Tỷ lệ tham gia', value: '68%' },
            { icon: Shield, label: 'Bảo mật', value: 'AES-256' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-4">
              <s.icon className="w-4 h-4 text-muted-foreground mb-2" />
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* CREATE ADMIN KEY */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Key className="w-5 h-5" />
            Tạo Admin Key
          </h3>

          <Button
            onClick={handleCreateKey}
            className="gradient-primary border-0 text-primary-foreground"
          >
            Tạo key mới
          </Button>

          {generatedKey && (
            <div className="mt-4 p-3 rounded-xl bg-muted/40 text-sm break-all">
              <strong>Admin Key:</strong> {generatedKey}
              <p className="text-xs text-muted-foreground mt-1">
                Key này chỉ dùng được 1 lần
              </p>
            </div>
          )}
        </motion.div>

        {/* Candidate + Log */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Candidate management */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-4">Quản lý ứng viên</h3>
            <div className="space-y-3">
              {candidates.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center font-bold text-primary-foreground text-sm shrink-0 overflow-hidden">
                    {c.imageUrl ? <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" /> : c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.voteCount} phiếu</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(c.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity log */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-4">Nhật ký hoạt động</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
              {[...logs].reverse().map((log, i) => (
                <div key={i} className="p-3 rounded-xl bg-muted/30 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">{log.action}</span>
                    <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString('vi-VN')}</span>
                  </div>
                  <div className="text-muted-foreground text-xs">{log.metadata}</div>
                  <div className="text-xs text-muted-foreground/70 mt-1">by {log.performedBy}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </AppLayout>
  );
}