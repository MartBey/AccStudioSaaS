import { Button, Card } from "ui";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="mb-6 text-center text-5xl font-extrabold tracking-tight text-primary">
          AccStudio
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-center text-xl text-muted-foreground">
          Markalar, ajanslar ve yetenekler arasında köprü kuran bütünleşik SaaS platformu.
          İhtiyacınız olan her şey tek bir yerde.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Markalar İçin</h2>
            <p className="mb-4 text-muted-foreground">
              En iyi yetenekleri bulun ve projelerinizi yönetin.
            </p>
            <Button className="w-full">Marka Olarak Katıl</Button>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Ajanslar İçin</h2>
            <p className="mb-4 text-muted-foreground">
              Ekiplerinizi, projelerinizi ve müşterilerinizi tek yerden yönetin.
            </p>
            <Button className="w-full" variant="secondary">
              Ajans Olarak Katıl
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Freelancerlar İçin</h2>
            <p className="mb-4 text-muted-foreground">
              Yeteneklerinizi sergileyin ve yeni iş fırsatları yakalayın.
            </p>
            <Button className="w-full" variant="outline">
              Freelancer Olarak Katıl
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
}
