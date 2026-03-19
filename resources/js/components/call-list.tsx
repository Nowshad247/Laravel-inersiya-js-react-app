
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"

export function CallList({ ButtonLabel = "Add Note" }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" >{ButtonLabel}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Call Now</DialogTitle>
                    <DialogDescription>
                        <form>
                            <div>
                                <Label htmlFor="result">Result</Label>
                                <select id="result" className="w-full border rounded p-2 mt-1">
                                    <option value="answered">Answered</option>
                                    <option value="no_answer">No Answer</option>
                                    <option value="busy">Busy</option>
                                 
                                    <option value="unavailable">Unavailable</option>
                                   
                                    <option value="interested">Interested</option>
                                    <option value="not_interested">Not Interested</option>
                                  
                                    <option value="call_back_later">Call Back Later</option>
                                
                                    <option value="meeting_scheduled">Meeting Scheduled</option>
                                    <option value="qualified">Qualified</option>
                               
                                    <option value="proposal_sent">Proposal Sent</option>
                           
                                    <option value="converted">Converted</option>
                                    <option value="wrong_person">Wrong Person</option>
                                    <option value="invalid_number">Invalid Number</option>
                                    
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="Remarks">Remarks</Label>
                                <Textarea id="Remarks" className="w-full border rounded p-2 mt-1" rows={4} placeholder="Add Remarks" />
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button type="submit">Save</Button>
                            </div>
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}