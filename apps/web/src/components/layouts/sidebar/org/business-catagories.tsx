"use client";

import type { Option } from "@aperturs/ui/auto-complete";
import { AutoComplete } from "@aperturs/ui/auto-complete";

const categories = [
  {
    value: "agriculture",
    label: "Agriculture",
  },
  {
    value: "construction",
    label: "Construction",
  },
  {
    value: "manufacturing",
    label: "Manufacturing",
  },
  {
    value: "mining_drilling",
    label: "Mining & Drilling",
  },
  {
    value: "transportation_logistics",
    label: "Transportation & Logistics",
  },
  {
    value: "retail_wholesale",
    label: "Retail & Wholesale",
  },
  {
    value: "information_technology",
    label: "Information Technology",
  },
  {
    value: "finance_insurance",
    label: "Finance & Insurance",
  },
  {
    value: "real_estate",
    label: "Real Estate",
  },
  {
    value: "healthcare",
    label: "Healthcare",
  },
  {
    value: "education",
    label: "Education",
  },
  {
    value: "government_non_profit",
    label: "Government & Non-Profit",
  },
  {
    value: "hospitality_tourism",
    label: "Hospitality & Tourism",
  },
  {
    value: "professional_services",
    label: "Professional Services",
  },
  {
    value: "media_entertainment",
    label: "Media & Entertainment",
  },
  {
    value: "marketing_sales",
    label: "Marketing & Sales",
  },
  {
    value: "human_resources",
    label: "Human Resources",
  },
  {
    value: "finance_accounting",
    label: "Finance & Accounting",
  },
  {
    value: "operations",
    label: "Operations",
  },
  {
    value: "customer_service",
    label: "Customer Service",
  },
  {
    value: "legal_compliance",
    label: "Legal & Compliance",
  },
  {
    value: "research_development",
    label: "Research & Development",
  },
  {
    value: "project_management",
    label: "Project Management",
  },
  {
    value: "content_creation",
    label: "Content Creation",
  },
  {
    value: "design",
    label: "Design",
  },
  {
    value: "data_analysis",
    label: "Data Analysis",
  },
  {
    value: "communication",
    label: "Communication",
  },
  {
    value: "collaboration",
    label: "Collaboration",
  },
  {
    value: "productivity",
    label: "Productivity",
  },
  {
    value: "personal_development",
    label: "Personal Development",
  },
];

interface BusinessCategoryProps {
  value: Option | undefined;
  setValue: (value: Option) => void;
}

export function BusinessCategory({ value, setValue }: BusinessCategoryProps) {
  return (
    // <Popover open={open} onOpenChange={setOpen} modal>
    //   <PopoverTrigger asChild>
    //     <Button
    //       variant="outline"
    //       role="combobox"
    //       aria-expanded={open}
    //       className="w-full justify-between"
    //     >
    //       {value
    //         ? categories.find((category) => category.value === value)?.label
    //         : "Select Catagory..."}
    //       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    //     </Button>
    //   </PopoverTrigger>
    //   <PopoverContent className="p-0">
    //     <Command>
    //       <CommandInput placeholder="Search Category..." />
    //       <ScrollArea className="h-56 overflow-y-scroll">
    //         {/* <CommandEmpty>No framework found.</CommandEmpty> */}
    //         <CommandGroup>
    //           {categories.map((category) => (
    //             <CommandItem
    //               key={category.value}
    //               value={category.value}
    //               onSelect={(currentValue) => {
    //                 setValue(currentValue === value ? "" : currentValue);
    //                 setOpen(false);
    //               }}
    //             >
    //               <Check
    //                 className={cn(
    //                   "mr-2 h-4 w-4",
    //                   value === category.value ? "opacity-100" : "opacity-0"
    //                 )}
    //               />
    //               {category.label}
    //             </CommandItem>
    //           ))}
    //         </CommandGroup>
    //       </ScrollArea>
    //     </Command>
    //   </PopoverContent>
    // </Popover>

    <AutoComplete
      options={categories}
      value={value}
      onValueChange={setValue}
      emptyMessage="No resulsts."
      allowCustomInput
      placeholder="Search Category..."
    />
  );
}
