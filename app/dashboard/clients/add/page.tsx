import { AddClientForm } from "@/components/add-client-form"

export default function AddClientPage() {
  return (
    <main className="flex-1 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-2">Add New Client</h1>
        <p className="text-zinc-500 mb-6">Create a new client and start the onboarding process.</p>
        <AddClientForm />
      </div>
    </main>
  )
}

