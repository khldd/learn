"use client"

import { Fragment } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Option {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  className?: string
}

export function Select({ value, onChange, options, placeholder = "Select...", className }: SelectProps) {
  const selectedOption = options.find((option) => option.value === value)

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button
          className={cn(
            "relative w-full cursor-default bg-background border border-input py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm",
            className,
          )}
        >
          <span className="block truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-background border border-input py-1 text-base shadow-lg focus:outline-none sm:text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                className={({ active }) =>
                  cn(
                    "relative cursor-default select-none py-2 pl-10 pr-4",
                    active ? "bg-primary text-primary-foreground" : "text-foreground",
                  )
                }
                value={option.value}
              >
                {({ selected }) => (
                  <>
                    <span className={cn("block truncate", selected ? "font-medium" : "font-normal")}>
                      {option.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-foreground">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
