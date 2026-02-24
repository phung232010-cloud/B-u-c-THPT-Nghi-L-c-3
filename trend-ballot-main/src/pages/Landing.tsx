import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Vote, Shield, BarChart3, Zap, Users, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Shield, title: 'Bảo mật AES-256', desc: 'Mã hóa dữ liệu đầu cuối, bảo vệ tuyệt đối mọi phiếu bầu.' },
  { icon: BarChart3, title: 'Phân tích AI', desc: 'Dự đoán xu hướng và kết quả với Machine Learning tiên tiến.' },
  { icon: Zap, title: 'Realtime', desc: 'Cập nhật kết quả tức thì với WebSocket, không delay.' },
  { icon: Users, title: 'Đa vai trò', desc: 'Phân quyền User, Admin, Superadmin rõ ràng.' },
];

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '< 50ms', label: 'Latency' },
  { value: '10K+', label: 'Users' },
  { value: '256-bit', label: 'Encryption' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Vote className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">VoteChain</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Tính năng</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Thống kê</a>
            <a href="#ai" className="hover:text-foreground transition-colors">AI</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Đăng nhập</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="gradient-primary border-0 text-primary-foreground">Bắt đầu</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* BG effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-[100px] animate-pulse-slow" />

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted-foreground mb-8">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Hệ thống đang hoạt động
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Bỏ phiếu
              <span className="gradient-text"> thông minh</span>
              <br />
              với sức mạnh <span className="gradient-text">AI</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Nền tảng bỏ phiếu trực tuyến bảo mật cấp ngân hàng, phân tích real-time
              bằng Machine Learning. Minh bạch, nhanh chóng, đáng tin cậy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="gradient-primary border-0 text-primary-foreground px-8 text-base glow-primary">
                  Tham gia ngay <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="px-8 text-base border-border/50">
                  Xem Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            id="stats"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-20 glass rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tính năng <span className="gradient-text">vượt trội</span></h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Được xây dựng với công nghệ mới nhất, đảm bảo bảo mật và hiệu suất tối ưu.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 hover:border-primary/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:glow-primary transition-shadow">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="glass rounded-3xl p-8 md:p-12 gradient-hero">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  AI <span className="gradient-text">Dự đoán</span> kết quả
                </h2>
                <p className="text-muted-foreground mb-6">
                  Sử dụng Linear & Logistic Regression phân tích xu hướng phiếu bầu,
                  dự đoán ứng viên chiến thắng với độ tin cậy cao.
                </p>
                <ul className="space-y-3">
                  {['Phân tích trend tăng trưởng phiếu', 'Dự báo kết quả 24h tới', 'Confidence score & risk factor', 'Biểu đồ dự đoán trực quan'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">AI Prediction Engine</span>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Lê Hoàng Cường', pct: 85, color: 'bg-primary' },
                    { name: 'Nguyễn Văn An', pct: 72, color: 'bg-accent' },
                    { name: 'Trần Thị Bình', pct: 58, color: 'bg-success' },
                  ].map(p => (
                    <div key={p.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{p.name}</span>
                        <span className="text-muted-foreground">{p.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${p.color}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${p.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                  Mô hình: Linear Regression · Confidence: 87.3% · Updated: Live
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <Vote className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">VoteChain</span>
          </div>
          <p>© 2024 VoteChain. Secured by AES-256 Encryption.</p>
        </div>
      </footer>
    </div>
  );
}
