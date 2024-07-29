"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddDepartmentProps {
  onAdd: (departmentName: string) => void
}

const AddDepartment: React.FC<AddDepartmentProps> = ({ onAdd }) => {
  const [open, setOpen] = useState(false)
  const [departmentName, setDepartmentName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (departmentName.trim()) {
      onAdd(departmentName.trim())
      setDepartmentName('')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add Department</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Add Department</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddDepartment