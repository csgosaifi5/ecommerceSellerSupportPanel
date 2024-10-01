import { PropsWithChildren } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area"; 
import { Button } from "../ui/button";

const TermsDialog = ({ children }: PropsWithChildren) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[80vh]">
          <p className="font-medium">
            <h1 className=" font-bold mb-4">YOUR AGREEMENT</h1>
            <p className="mb-4">
             {` By using this Site, you agree to be bound by, and to comply with,
              these Terms and Conditions. If you do not agree to these Terms and
              Conditions, please do not use this site.`}
            </p>
            <p className="mb-4 text-gray-900 ">
              {`PLEASE NOTE: We reserve the right, at our sole discretion, to
              change, modify or otherwise alter these Terms and Conditions at
              any time. Unless otherwise indicated, amendments will become
              effective immediately. Please review these Terms and Conditions
              periodically. Your continued use of the Site following the posting
              of changes and/or modifications will constitute your acceptance of
              the revised Terms and Conditions and the reasonableness of these
              standards for notice of changes. For your information, this page
              was last updated as of the date at the top of these terms and
              conditions.`}
            </p>
            2. PRIVACY <br />
           {` Please review our Privacy Policy, which also governs your visit to
            this Site, to understand our practices.`}
            <br />
            3. LINKED SITES
            <br />
        {`    This Site may contain links to other independent third-party Web
            sites ("Linked Sites”). These Linked Sites are`}
            <br />
            . FORWARD LOOKING STATEMENTS
            <br />
           {` All materials reproduced on this site speak as of the original date
            of publication or filing. The fact that a document is available on
            this site does not mean that the information contained in such
            document has not been modified or superseded by events or by a
            subsequent document or filing. We have no duty or policy to update
            any information or statements contained on this site and, therefore,
            such information or statements should not be relied upon as being
            current as of the date you access this site. 5. DISCLAIMER OF
            WARRANTIES AND LIMITATION OF LIABILITY A. THIS SITE MAY CONTAIN
            INACCURACIES AND TYPOGRAPHICAL ERRORS. WE DOES NOT WARRANT THE
            ACCURACY OR COMPLETENESS OF THE MATERIALS OR THE RELIABILITY OF ANY
            ADVICE, OPINION, STATEMENT OR OTHER INFORMATION DISPLAYED OR
            DISTRIBUTED THROUGH THE SITE. YOU EXPRESSLY UNDERSTAND AND AGREE
            THAT: (i) YOUR USE OF THE SITE, INCLUDING ANY RELIANCE ON ANY SUCH
            OPINION, ADVICE, STATEMENT, MEMORANDUM, OR INFORMATION CONTAINED
            HEREIN, SHALL BE AT YOUR SOLE RISK; (ii) THE SITE IS PROVIDED ON AN
            "AS IS" AND "AS AVAILABLE" BASIS; (iii) EXCEPT AS EXPRESSLY PROVIDED
            HEREIN WE DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
            IMPLIED, INCLUDING, BUT NOT LIMITED TO IMPLIED WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, WORKMANLIKE
            EFFORT, TITLE AND NON-INFRINGEMENT; (iv) WE MAKE NO WARRANTY WITH
            RESPECT TO THE RESULTS THAT MAY BE OBTAINED FROM THIS SITE, THE
            PRODUCTS OR SERVICES ADVERTISED OR OFFERED OR MERCHANTS INVOLVED;
            (v) ANY MATERIAL DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE USE OF
            THE SITE IS DONE AT YOUR OWN DISCRETION AND RISK; and (vi) YOU WILL
            BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM OR FOR
            ANY LOSS OF DATA THAT RESULTS FROM THE DOWNLOAD OF ANY SUCH
            MATERIAL. B. YOU UNDERSTAND AND AGREE THAT UNDER NO CIRCUMSTANCES,
            INCLUDING, BUT NOT LIMITED TO, NEGLIGENCE, SHALL WE BE LIABLE FOR
            ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE OR CONSEQUENTIAL
            DAMAGES THAT RESULT FROM THE USE OF, OR THE INABILITY TO USE, ANY OF
            OUR SITES OR MATERIALS OR FUNCTIONS ON ANY SUCH SITE, EVEN IF WE
            HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. THE FOREGOING
            LIMITATIONS SHALL APPLY NOTWITHSTANDING ANY FAILURE OF ESSENTIAL
            PURPOSE OF ANY LIMITED REMEDY.`}
          </p>
          <br />
          <DialogClose>
            <Button
              variant={"outline"}
              className="border-gray-200 text-gray-700"
            >
              Close
            </Button>
          </DialogClose>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TermsDialog;
