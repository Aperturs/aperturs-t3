// import type {
//   FBPageIgConnectDataArray,
//   SearchParams,
// } from "@aperturs/validators/socials";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@aperturs/ui/components/ui/card";
// import { RadioGroup } from "@aperturs/ui/components/ui/radio-group";
// import { addInstagramSchema } from "@aperturs/validators/socials";

// import DisplayCard from "./display-card";

// export default function Instagram({ params }: SearchParams) {
//   console.log(params);

//   const {
//     access_token,
//     data_access_expiration_time,
//     expires_in,
//     long_lived_token,
//   } = addInstagramSchema.parse(params);

//   const data = fetch(`https://graph.facebook.com/v19.0/me/accounts?
//   fields=id%2Cname%2Caccess_token%2Cinstagram_business_account&access_token=${access_token}`) as unknown as FBPageIgConnectDataArray;

//   return (
//     <section>
//       <RadioGroup
//         defaultValue={data.data[0]?.connected_instagram_account?.id ?? ""}
//       >
//         <Card>
//           <CardHeader>
//             <CardTitle>Select a page to Connect</CardTitle>
//             {/* <CardDescription>
//                 <AlertDialog>

//                 </AlertDialog>
//             </CardDescription> */}
//           </CardHeader>
//           <CardContent className="flex w-full flex-col gap-2">
//             {data.data.map((page) => {
//               return <DisplayCard key={page.id} {...page} />;
//             })}
//           </CardContent>
//         </Card>
//       </RadioGroup>
//     </section>
//   );
// }

export default function page() {
  return <div></div>;
}
