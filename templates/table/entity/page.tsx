import { DataTable } from "@/components/table/data-table"
import { columns, {{ENTITY_NAME_PASCAL}} } from "./columns"
import { tableConfig } from "./table-config"

async function getData(): Promise<{{ENTITY_NAME_PASCAL}}[]> {
  // Replace this with your actual data fetching logic
  // Example:
  // const response = await fetch('/api/{{ENTITY_NAME_KEBAB}}')
  // if (!response.ok) {
  //   throw new Error('Failed to fetch data')
  // }
  // return response.json()
  
  // Sample data for development
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
      <DataTable 
        columns={columns} 
        data={data}
        searchColumn={tableConfig.searchColumn}
        searchPlaceholder={tableConfig.searchPlaceholder}
        filters={tableConfig.filters}
        config={tableConfig}
      />
    </div>
  )
}