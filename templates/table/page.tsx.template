import { columns, {{ENTITY_NAME_PASCAL}} } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<{{ENTITY_NAME_PASCAL}}[]> {
  // Fetch data from your API here.
  // For now, returning sample data
  return [
    {
      id: "1",
      // Add sample data fields here
    },
    {
      id: "2",
      // Add sample data fields here
    },
    {
      id: "3",
      // Add sample data fields here
    },
  ]
}

export default async function {{ENTITY_NAME_PASCAL}}Page() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">{{ENTITY_NAME_TITLE}}</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}