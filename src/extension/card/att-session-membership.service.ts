import { Injectable } from "@nestjs/common";
import { CardMembership } from "./models/card-membership.model";
var mongoose = require('mongoose')
@Injectable()
export class AttSessionMembershipService {
   async findMembershipByCardAndAttSession(cardId: string, attSessId: string, page: number, filter: string, status: string) {
      let filterMatchAndCond: any[] = [
         {
            $or: [
               {
                  "user.firstName": {
                     $regex: filter,
                     $options: 'i',
                  }
               },
               {
                  "user.lastName": {
                     $regex: filter,
                     $options: 'i',
                  }
               },
               {
                  "user.username": {
                     $regex: filter,
                     $options: 'i',
                  }
               }
            ],
         },
      ];

      if (status) {
         filterMatchAndCond.push({ "attendance.status": status });
      }

      const membershipByCardAndAttSession = await CardMembership.aggregate([
         {
            $match: {
               $expr: {
                  $eq: ["$card", mongoose.Types.ObjectId(cardId)]
               }
            }
         },
         {
            $lookup: {
               from: "cards",
               let: { card_id: "$card" },
               as: "card",
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $eq: ["$_id", "$$card_id"]
                        }
                     }
                  },
                  {
                     $project: {
                        id: "$_id",
                        name: 1,
                        extensionKeyname: 1,
                     }
                  }
               ]
            }
         },
         { "$unwind": "$card" },
         {
            $lookup: {
               from: "attendances",
               let: { user_id: "$user" },
               as: "attendance",
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $and: [
                              { $eq: ["$user", "$$user_id"] },
                              { $eq: ["$attdSession", mongoose.Types.ObjectId(attSessId)] },
                           ]
                        }
                     }
                  },
                  {
                     $project: {
                        id: "$_id",
                        checkInAt: 1,
                        checkOutAt: 1,
                        remark: 1,
                        status: 1,
                        attdSession: 1,
                     }
                  },
               ]
            }
         },
         { "$unwind": { path: "$attendance", preserveNullAndEmptyArrays: true } },
         {
            $lookup: {
               from: "users",
               let: { user_id: "$user" },
               as: "user",
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $eq: ["$_id", "$$user_id"]
                        }
                     }
                  },
                  {
                     $project: {
                        id: "$_id",
                        email: 1,
                        username: 1,
                        firstName: 1,
                        lastName: 1,
                        activated: 1
                     }
                  }
               ]
            }
         },
         { "$unwind": "$user" },
         {
            $match: {
               $and: filterMatchAndCond
            }
         },
         {
            $project: {
               "id": "$_id",
               user: 1,
               card: 1,
               approved: 1,
               expiredAt: 1,
               issuedAt: 1,
               attendance: 1
            }
         }
      ]).skip(page * 10).limit(10);

      if (!membershipByCardAndAttSession?.length)
         return []


      return membershipByCardAndAttSession;
   }

   async exportMembershipByAttSession(cardId: string, attSessId: string) {
      const membershipByCardAndAttSession = await CardMembership.aggregate([
         {
            $match: {
               $expr: {
                  $eq: ["$card", mongoose.Types.ObjectId(cardId)]
               }
            }
         },
         {
            $lookup: {
               from: "cards",
               let: { card_id: "$card" },
               as: "card",
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $eq: ["$_id", "$$card_id"]
                        }
                     }
                  },
                  {
                     $project: {
                        id: "$_id",
                        name: 1,
                        extensionKeyname: 1,
                        channel: 1
                     }
                  },
                  {
                     $lookup: {
                        from: "channels",
                        let: { channel_id: "$channel" },
                        as: "channel",
                        pipeline: [
                           {
                              $match: {
                                 $expr: {
                                    $eq: ["$_id", "$$channel_id"]
                                 }
                              }
                           },
                           {
                              $project: {
                                 id: "$_id"
                              }
                           },
                        ]
                     }
                  },
                  { "$unwind": "$channel" },
               ]
            }
         },
         { "$unwind": "$card" },
         {
            $lookup: {
               from: "attendances",
               let: { user_id: "$user" },
               as: "attendance",
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $and: [
                              { $eq: ["$user", "$$user_id"] },
                              { $eq: ["$attdSession", mongoose.Types.ObjectId(attSessId)] },
                           ]
                        }
                     }
                  },
                  {
                     $project: {
                        id: "$_id",
                        checkInAt: 1,
                        checkOutAt: 1,
                        remark: 1,
                        status: 1,
                        attdSession: 1,
                     }
                  },
               ]
            }
         },
         { "$unwind": { path: "$attendance", preserveNullAndEmptyArrays: true } },
         {
            $lookup: {
               from: "users",
               let: { user_id: "$user" },
               as: "user",
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $eq: ["$_id", "$$user_id"]
                        }
                     }
                  },
                  {
                     $project: {
                        id: "$_id",
                        email: 1,
                        username: 1,
                        firstName: 1,
                        lastName: 1,
                        activated: 1
                     }
                  }
               ]
            }
         },
         { "$unwind": "$user" },
         {
            $lookup: {
               from: "channelremarks",
               let: { user_id: "$user._id", channel_id: "$card.channel._id" },
               as: "channelRemarks",
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $and: [
                              { $eq: ["$channel", "$$channel_id"] },
                           ]
                        }
                     },
                  },
                  {
                     $project: {
                        _id: "$_id",
                        id: "$_id",
                        name: 1,
                        desc: 1,
                        channel: 1,
                        validationValues: 1,
                        followerRemarkField: 1,
                        isRequired: 1,
                        isEnable: 1,
                     }
                  },
                  {
                     $lookup: {
                        from: "followerremarkfields",
                        let: { remark_id: "$_id", channel_id: "$$channel_id", user_id: "$$user_id" },
                        as: "followerRemarkField",
                        pipeline: [{
                           $match: {
                              $expr: {
                                 $and: [
                                    { $eq: ["$remark", "$$remark_id"] },
                                    { $eq: ["$channel", "$$channel_id"] },
                                    { $eq: ["$user", "$$user_id"] }
                                 ]
                              }
                           }
                        },
                        {
                           $project: {
                              _id: "$_id",
                              id: "$_id",
                              value: 1,
                              remark: 1,
                              channel: 1,
                              user: 1,
                              createdAt: 1,
                              updatedAt: 1,
                           }
                        }
                        ]
                     }
                  },
                  { "$unwind": { path: "$followerRemarkField", preserveNullAndEmptyArrays: true } },
               ]
            }
         },
         {
            $project: {
               "id": "$_id",
               user: 1,
               card: 1,
               approved: 1,
               expiredAt: 1,
               issuedAt: 1,
               attendance: 1,
               attdSession: 1,
               channelRemarks: 1
            }
         }
      ]);

      if (!membershipByCardAndAttSession?.length)
         return []

      return membershipByCardAndAttSession;
   }

   async exportMembershipByCard(cardId: string, channelId: string) {
      const membershipByCardAndAttSession = await CardMembership.aggregate([
         {
            $match: {
               $expr: {
                  $eq: ["$card", mongoose.Types.ObjectId(cardId)]
               }
            }
         },
         {
            $lookup: {
               from: "cards",
               let: { card_id: "$card" },
               as: "card",
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $and: [
                              { $eq: ["$_id", "$$card_id"] },
                              { $eq: ["$channel", mongoose.Types.ObjectId(channelId)] }
                           ]
                        }
                     }
                  },
                  {
                     $project: {
                        id: "$_id",
                        name: 1,
                        extensionKeyname: 1,
                     }
                  },
               ]
            }
         },
         { "$unwind": "$card" },
         {
            $lookup: {
               from: "attendances",
               let: { user_id: "$user" },
               as: "attendance",
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $eq: ["$user", "$$user_id"],
                        }
                     }
                  },
                  {
                     $project: {
                        id: "$_id",
                        checkInAt: 1,
                        checkOutAt: 1,
                        status: 1,
                        remark: 1,
                        attdSession: 1
                     }
                  },
                  {
                     $lookup: {
                        from: "attdsessions",
                        as: "attdSession",
                        let: { attdSession_id: "$attdSession" },
                        pipeline: [
                           {
                              $match: {
                                 $expr: {
                                    $eq: ["$_id", "$$attdSession_id"]
                                 }
                              }
                           },
                           {
                              $project: {
                                 id: "$_id",
                                 name: 1,
                                 startAt: 1,
                                 endAt: 1,
                                 lateInMins: 1,
                                 hasLatetime: 1
                              }
                           }
                        ]
                     }
                  },
                  { "$unwind": "$attdSession" },
               ]
            }
         },
         { "$unwind": { path: "$attendance", preserveNullAndEmptyArrays: true } },
         {
            $lookup: {
               from: "users",
               let: { user_id: "$user" },
               as: "user",
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $eq: ["$_id", "$$user_id"]
                        }
                     }
                  },
                  {
                     $project: {
                        id: "$_id",
                        email: 1,
                        username: 1,
                        firstName: 1,
                        lastName: 1,
                        activated: 1
                     }
                  },
               ]
            }
         },
         { "$unwind": "$user" },
         {
            $lookup: {
               from: "channelremarks",
               let: { user_id: "$user._id" },
               as: "channelRemarks",
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $and: [
                              { $eq: ["$channel", mongoose.Types.ObjectId(channelId)] },
                           ]
                        }
                     },
                  },
                  {
                     $project: {
                        _id: "$_id",
                        id: "$_id",
                        name: 1,
                        desc: 1,
                        channel: 1,
                        validationValues: 1,
                        followerRemarkField: 1,
                        isRequired: 1,
                        isEnable: 1,
                     }
                  },
                  {
                     $lookup: {
                        from: "followerremarkfields",
                        let: { remark_id: "$_id", card_id: "$card", channel_id: "$channelId", user_id: "$$user_id" },
                        as: "followerRemarkField",
                        pipeline: [{
                           $match: {
                              $expr: {
                                 $and: [
                                    { $eq: ["$remark", "$$remark_id"] },
                                    { $eq: ["$channel", mongoose.Types.ObjectId(channelId)] },
                                    { $eq: ["$user", "$$user_id"] }
                                 ]
                              }
                           }
                        },
                        {
                           $project: {
                              _id: "$_id",
                              id: "$_id",
                              value: 1,
                              remark: 1,
                              channel: 1,
                              user: 1,
                              createdAt: 1,
                              updatedAt: 1,
                           }
                        }
                        ]
                     }
                  },
                  { "$unwind": { path: "$followerRemarkField", preserveNullAndEmptyArrays: true } },
               ]
            }
         },
         {
            $project: {
               "id": "$_id",
               approved: 1,
               expiredAt: 1,
               issuedAt: 1,
               user: 1,
               card: 1,
               attendance: 1,
               channelRemarks: 1
            }
         }
      ]);

      if (!membershipByCardAndAttSession?.length)
         return [];
      console.log(membershipByCardAndAttSession);
      return membershipByCardAndAttSession;
   }


   async findAttdByCardAndAttdSession(cardId: string, channelId: string) {
      const membershipByCardAndAttSession = await CardMembership.aggregate([
         {
            $match: {
               $expr: {
                  $eq: ["$card", mongoose.Types.ObjectId(cardId)]
               }
            }
         },
         {
            $lookup: {
               from: "cards",
               let: { card_id: "$card" },
               as: "card",
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $and: [
                              { $eq: ["$_id", "$$card_id"] },
                              { $eq: ["$channel", mongoose.Types.ObjectId(channelId)] }
                           ]
                        }
                     }
                  },
                  {
                     $project: {
                        id: "$_id",
                        name: 1,
                        extensionKeyname: 1,
                     }
                  },
               ]
            }
         },
         { "$unwind": "$card" },
         {
            $lookup: {
               from: "attdsessions",
               as: "attdSession",
               let: { card_id: "$cardId" },
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           // $eq: ["$card", "$$card_id"]
                        }
                     }
                  },
                  {
                     $project: {
                        id: "$_id",
                        name: 1,
                        startAt: 1,
                        endAt: 1,
                        lateInMins: 1,
                        hasLatetime: 1
                     }
                  },
                  {
                     $lookup: {
                        from: "attendances",
                        let: { attdSession_id: "$_id" },
                        as: "attendance",
                        pipeline: [
                           {
                              $match: {
                                 $expr: {
                                    // $eq: ["$attdSession", "$$attdSession_id"],
                                 }
                              }
                           },
                           {
                              $project: {
                                 id: "$_id",
                                 checkInAt: 1,
                                 checkOutAt: 1,
                                 status: 1,
                                 remark: 1,

                              }
                           },

                        ]
                     }
                  },
                  // { "$unwind": { path: "$attendance", preserveNullAndEmptyArrays: true } },
               ]
            }
         },
         { "$unwind": "$attdSession" },

         {
            $lookup: {
               from: "users",
               let: { user_id: "$user" },
               as: "user",
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $eq: ["$_id", "$$user_id"]
                        }
                     }
                  },
                  {
                     $project: {
                        id: "$_id",
                        email: 1,
                        username: 1,
                        firstName: 1,
                        lastName: 1,
                        activated: 1
                     }
                  },
               ]
            }
         },
         { "$unwind": "$user" },

         {
            $project: {
               "id": "$_id",
               approved: 1,
               expiredAt: 1,
               issuedAt: 1,
               user: 1,
               card: 1,
               attdSession: 1,
            }
         }
      ]);

      if (!membershipByCardAndAttSession?.length)
         return [];

      console.log(membershipByCardAndAttSession);


      return membershipByCardAndAttSession;
   }
}
