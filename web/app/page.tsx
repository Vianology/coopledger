import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { IconLeaf as Leaf, IconShieldCheck as ShieldCheck, IconTrendingUp as TrendingUp, IconUsers as Users, IconArrowRight as ArrowRight, IconCircleCheck as CheckCircle2 } from '@tabler/icons-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            L'avenir de l'agriculture coopérative
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Une gestion transparente <br />
            <span className="text-primary">pour chaque agriculteur</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            CoopLedger transforme la gouvernance agricole. Participez activement aux décisions,
            suivez vos transactions en temps réel et bâtissez un avenir prospère et transparent
            avec votre communauté.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                Rejoindre maintenant <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full transition-transform hover:scale-105">
                Découvrir la plateforme
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-widest">
            Soutenu par les plus grandes coopératives du Togo
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50 grayscale">
            {['Union Café', 'Coop Cacao', 'AgriTogo', 'EcoFarm', 'TerraGreen'].map((name) => (
              <span key={name} className="text-xl font-bold text-foreground/60">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Pourquoi choisir CoopLedger ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nous apportons la technologie blockchain pour garantir que chaque centime et chaque vote
              soient comptabilisés avec une précision absolue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Transparence Totale"
              description="Accédez à l'historique complet des transactions de votre coopérative. Plus de doutes, seulement des preuves."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Vote Démocratique"
              description="Prenez part aux décisions cruciales. Votre voix compte réellement dans le choix des investissements et des stratégies."
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Suivi Financier"
              description="Gérez votre portefeuille personnel et suivez l'évolution des revenus de votre récolte en temps réel."
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Commencez en 3 étapes simples</h2>
              <div className="space-y-8">
                <Step number="1" title="Créez votre compte" description="Inscrivez-vous avec votre numéro de téléphone et vérifiez votre identité via WhatsApp." />
                <Step number="2" title="Rejoignez une coopérative" description="Sélectionnez votre coopérative existante ou créez-en une nouvelle pour vos pairs." />
                <Step number="3" title="Participez et Prospérez" description="Votez sur les projets, suivez vos gains et optimisez votre production agricole." />
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-square rounded-3xl bg-primary/10 flex items-center justify-center p-8">
                 <div className="w-full h-full rounded-2xl bg-background border border-border shadow-2xl p-6 overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                       <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Leaf className="text-primary h-5 w-5" />
                       </div>
                       <div>
                          <p className="font-bold text-sm">Coop-Cacao Nord</p>
                          <p className="text-xs text-muted-foreground">Gouvernance Active</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="p-3 rounded-xl bg-muted/50 border border-border">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Vote en cours</p>
                          <p className="text-sm font-semibold">Achat de nouveau matériel</p>
                          <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
                             <div className="h-full bg-primary w-2/3" />
                          </div>
                          <div className="flex justify-between mt-2 text-[10px] font-medium">
                             <span>68% Participation</span>
                             <span>3 jours restants</span>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <Button className="flex-1 h-9 text-xs rounded-full">OUI</Button>
                          <Button variant="outline" className="flex-1 h-9 text-xs rounded-full">NON</Button>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-[3rem] p-12 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />

            <h2 className="text-3xl lg:text-5xl font-bold mb-6 relative z-10">
              Prêt à transformer votre <br /> exploitation agricole ?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-10 relative z-10 text-lg">
              Rejoignez des milliers d'agriculteurs qui font déjà confiance à CoopLedger pour une gestion saine et transparente.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="h-12 px-10 text-lg rounded-full relative z-10 shadow-xl">
                Créer mon compte gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">C</span>
              </div>
              <span className="text-xl font-bold font-sans tracking-tight">CoopLedger</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">Confidentialité</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Conditions</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 CoopLedger. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl border border-border bg-card hover:border-primary/50 transition-all duration-300 group">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
        {number}
      </div>
      <div>
        <h4 className="text-lg font-bold mb-1">{title}</h4>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
