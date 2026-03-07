import { Button, Card } from "ui";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-background">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-5xl font-extrabold text-center tracking-tight text-primary mb-6">
          AccStudio
        </h1>
        <p className="text-center text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Markalar, ajanslar ve yetenekler arasında köprü kuran bütünleşik SaaS platformu. İhtiyacınız olan her şey tek bir yerde.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Markalar İçin</h2>
            <p className="text-muted-foreground mb-4">En iyi yetenekleri bulun ve projelerinizi yönetin.</p>
            <Button className="w-full">Marka Olarak Katıl</Button>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Ajanslar İçin</h2>
            <p className="text-muted-foreground mb-4">Ekiplerinizi, projelerinizi ve müşterilerinizi tek yerden yönetin.</p>
            <Button className="w-full" variant="secondary">Ajans Olarak Katıl</Button>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Freelancerlar İçin</h2>
            <p className="text-muted-foreground mb-4">Yeteneklerinizi sergileyin ve yeni iş fırsatları yakalayın.</p>
            <Button className="w-full" variant="outline">Freelancer Olarak Katıl</Button>
          </Card>
        </div>
      </div>
    </main>
  );
}
