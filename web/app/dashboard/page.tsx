"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import {
  IconTrendingUp as TrendingUp,
  IconArrowUpRight as ArrowUpRight,
  IconArrowDownLeft as ArrowDownLeft,
  IconLeaf as Leaf,
  IconBell as Bell,
  IconLogout as LogOut,
  IconChevronRight as ChevronRight,
  IconCreditCard as CreditCard
} from '@tabler/icons-react';

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const user = await userResponse.json();

        const dashResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const dash = await dashResponse.json();

        setUserData(user);
        setDashboardData(dash);
      } catch (e) {
        console.error('Error loading dashboard:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bonjour, {userData?.name} 👋</h1>
            <p className="text-muted-foreground">Voici l'état actuel de vos activités coopératives.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4 mr-2" /> Déconnexion
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wallet Card */}
          <div className="lg:col-span-2">
            <div className="bg-primary rounded-[2rem] p-8 text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-primary-foreground/70 text-sm font-medium mb-2">
                  <CreditCard className="h-4 w-4" />
                  <span>MON PORTEFEUILLE</span>
                </div>
                <div className="text-5xl font-bold mb-8">
                  {dashboardData?.balance || '0'} <span className="text-2xl opacity-80">{dashboardData?.currency || 'FCFA'}</span>
                </div>
                <div className="flex gap-4">
                  <Button variant="secondary" className="rounded-full px-6 h-11 font-semibold">Envoyer</Button>
                  <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-full px-6 h-11 font-semibold">Recevoir</Button>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Activité Récente</h2>
                <Button variant="ghost" className="text-primary hover:text-primary text-sm font-medium">Voir tout</Button>
              </div>
              <div className="bg-card border border-border rounded-3xl overflow-hidden">
                <div className="divide-y divide-border">
                  {dashboardData?.transactions?.map((tx: any, i: number) => (
                    <div key={tx.id || i} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {tx.type === 'deposit' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium">{tx.description || tx.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className={`font-bold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'deposit' ? '+' : '-'} {tx.amount} FCFA
                      </div>
                    </div>
                  ))}
                  {(!dashboardData?.transactions || dashboardData.transactions.length === 0) && (
                    <div className="p-8 text-center text-muted-foreground">
                      Aucune transaction récente.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Side Column */}
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-[2rem] p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Mes Coopératives
              </h3>
              <div className="space-y-4">
                {dashboardData?.cooperatives?.map((coop: any, i: number) => (
                  <div key={coop.id || i} className="p-4 rounded-2xl bg-muted/50 border border-border flex items-center justify-between group hover:border-primary/50 transition-all">
                    <div>
                      <p className="font-bold">{coop.name}</p>
                      <p className="text-xs text-muted-foreground">Membre actif</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
                {(!dashboardData?.cooperatives || dashboardData.cooperatives.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucune coopérative.</p>
                )}
              </div>
            </div>

            <div className="bg-secondary/30 border border-secondary/20 rounded-[2rem] p-6">
              <div className="flex items-center gap-2 text-secondary-foreground font-bold mb-4">
                <TrendingUp className="h-5 w-5" />
                <span>Statistiques</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Rendement estimé</span>
                  <span className="font-bold text-green-600">+12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Participation votes</span>
                  <span className="font-bold">85%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
