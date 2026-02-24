import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Vote as VoteIcon, Trophy, TrendingUp, Users, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/AppLayout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function VotingPage() {
  const { candidates, user, vote, unvote } = useAppStore();
  const { toast } = useToast();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [showUnvote, setShowUnvote] = useState(false);

  const sorted = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
  const totalVotes = candidates.reduce((s, c) => s + c.voteCount, 0);
  const leader = sorted[0];

  const handleVote = () => {
    if (!confirmId) return;
    const ok = vote(confirmId);
    if (ok) {
      toast({ title: 'Bỏ phiếu thành công!', description: 'Cảm ơn bạn đã tham gia.' });
    } else {
      toast({ title: 'Không thể bỏ phiếu', description: 'Bạn đã bỏ phiếu rồi.', variant: 'destructive' });
    }
    setConfirmId(null);
  };

  const handleUnvote = () => {
    const ok = unvote();
    if (ok) {
      toast({ title: 'Đã hủy bầu chọn', description: 'Bạn có thể bầu cho ứng viên khác.' });
    }
    setShowUnvote(false);
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Bỏ phiếu</h1>
          <p className="text-muted-foreground mb-8">Chọn ứng viên bạn tin tưởng. Bạn có thể đổi phiếu bầu.</p>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Ứng viên', value: candidates.length },
            { icon: VoteIcon, label: 'Tổng phiếu', value: totalVotes },
            { icon: Trophy, label: 'Dẫn đầu', value: leader?.name.split(' ').pop() || '-' },
            { icon: TrendingUp, label: 'Tỷ lệ', value: totalVotes > 0 ? `${Math.round((leader?.voteCount / totalVotes) * 100)}%` : '0%' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <s.icon className="w-3.5 h-3.5" />
                {s.label}
              </div>
              <div className="text-xl font-bold">{s.value}</div>
            </motion.div>
          ))}
        </div>

        {user?.hasVoted && (
          <div className="glass rounded-xl p-4 mb-6 flex items-center justify-between border-success/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span className="text-sm">Bạn đã bầu cho: <strong>{candidates.find(c => c.id === user.votedCandidateId)?.name}</strong></span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowUnvote(true)} className="border-destructive/50 text-destructive hover:bg-destructive/10">
              <XCircle className="w-4 h-4 mr-2" /> Hủy bầu chọn
            </Button>
          </div>
        )}

        {/* Candidate grid */}
        <div className="grid md:grid-cols-2 gap-5">
          <AnimatePresence>
            {sorted.map((c, i) => {
              const pct = totalVotes > 0 ? (c.voteCount / totalVotes) * 100 : 0;
              const isVoted = user?.votedCandidateId === c.id;
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`glass rounded-2xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all ${i === 0 ? 'ring-1 ring-primary/30' : ''} ${isVoted ? 'ring-2 ring-success/50' : ''}`}
                >
                  {i === 0 && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold gradient-primary text-primary-foreground">
                      #1 Dẫn đầu
                    </div>
                  )}
                  {isVoted && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success text-success-foreground">
                      ✓ Đã chọn
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shrink-0 text-xl font-bold text-primary-foreground overflow-hidden">
                      {c.imageUrl ? <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" /> : c.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{c.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{c.voteCount} phiếu</span>
                      <span className="font-medium">{pct.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full gradient-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      className="w-full gradient-primary border-0 text-primary-foreground"
                      disabled={!user || user.hasVoted}
                      onClick={() => setConfirmId(c.id)}
                    >
                      {isVoted ? 'Đã bầu chọn' : user?.hasVoted ? 'Đã bỏ phiếu' : 'Bỏ phiếu'}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Vote confirm */}
      <AlertDialog open={!!confirmId} onOpenChange={() => setConfirmId(null)}>
        <AlertDialogContent className="glass-strong border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận bỏ phiếu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có thể thay đổi phiếu bầu sau. Bạn có chắc chắn muốn bầu cho ứng viên này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleVote} className="gradient-primary border-0 text-primary-foreground">
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unvote confirm */}
      <AlertDialog open={showUnvote} onOpenChange={setShowUnvote}>
        <AlertDialogContent className="glass-strong border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy bầu chọn?</AlertDialogTitle>
            <AlertDialogDescription>
              Phiếu bầu của bạn sẽ bị hủy. Bạn có thể bầu cho ứng viên khác sau đó.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnvote} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hủy bầu chọn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
