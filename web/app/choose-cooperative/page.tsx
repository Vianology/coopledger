"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { IconLeaf as Leaf, IconPlus as Plus, IconUsers as Users } from '@tabler/icons-react';

export default function ChooseCooperativePage() {
  const router = useRouter();
  const [cooperatives, setCooperatives] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCooperatives();
  }, []);

  const fetchCooperatives = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cooperatives`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setCooperatives(data);
    } catch (e) {
      console.error('Failed to fetch cooperatives:', e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!// name) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cooperatives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description }),
      });

      const text = await response.text();
      try {
        const result = JSON.parse(text);
        if (!response.ok) throw new Error(result.error || 'Failed to create cooperative');
        router.replace('/dashboard');
      } catch (e) {
        console.error('Server returned non-JSON response:', text);
        throw new Error('Le serveur a renvoyé une réponse invalide.');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (cooperativeId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cooperatives/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cooperativeId }),
      });

      const text = await response.text();
      try {
        const result = JSON.parse(text);
        if (!response.ok) throw new Error(result.error || 'Failed to join cooperative');
        router.replace('/dashboard');
      } catch (e) {
        console.error('Server returned non-JSON response:', text);
        throw new Error('Le serveur a renvoyé une réponse invalide.');
      }
    } catch (e: any) {
      alert(e.// message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Ma Coopérative</h1>
          <p className="text-muted-foreground">Créez votre propre coopérative ou rejoignez-en une existante pour commencer.</p>
        </div>

        {!creating ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cooperatives.map((coop) => (
                <div key={coop.id} className="p-6 rounded-3xl border border-border bg-card flex items-center justify-between gap-4 hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <Leaf className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">{coop.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{coop.description || 'Aucune description'}</p>
                    </div>
                  </div>
                  <Button onClick={() => handleJoin(coop.id)} variant="default" className="rounded-full px-4">
                    Rejoindre
                  </Button>
                </div>
              ))}
              {cooperatives.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  Aucune coopérative disponible pour le moment.
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 py-8">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground uppercase">Ou</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="flex justify-center">
              <Button onClick={() => setCreating(true)} variant="outline" className="rounded-full px-8 h-12 text-base">
                <Plus className="mr-2 h-4 w-4" /> Créer une coopérative
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto space-y-8 p-8 rounded-[2rem] bg-card border border-border shadow-xl">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Nouvelle Coopérative</h2>
              <p className="text-muted-foreground">Définissez les bases de votre collectif</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la coopérative</Label>
                <Input
                  id="name"
                  placeholder="ex: Coop-Cacao Nord"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Décrivez vos objectifs..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="ghost" className="flex-1 rounded-full" onClick={() => setCreating(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="flex-1 rounded-full" disabled={loading}>
                  {loading ? 'Création...' : 'Créer'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
