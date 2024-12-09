import { BadRequestException, Injectable } from "@nestjs/common";
import { transformArrToJson } from "src/utils";
import { FollowerRemarkFieldService } from "./follower-remark-field.service";
import { ChannelRemark } from "./models/channel-remark.model";
import { ChFollowerRemarkFieldInput, SetChFollowerRemarkFieldsInput } from "./type-defs/channel-remark";
const mongoose = require('mongoose');

@Injectable()
export class ChannelRemarkService {
   constructor(
      private followerRemarkFieldService: FollowerRemarkFieldService
   ) { }

   async create(params): Promise<any> {
      console.log(params.validationValues);
      const found = await ChannelRemark.find({ channel: params.channel, name: { $in: params.name } });
      if (found.length) throw new BadRequestException("This remark name is already existing");
      if (params.type == "TEXT") {
         const channelRemark = ChannelRemark.build({
            name: params.name,
            desc: params.desc,
            channel: params.channel,
            validationValues: params.validationValues,
            type: params.type,
            isRequired: params.isRequired,
            isEnable: params.isEnable
         })
         const created = await channelRemark.save();
         return created.toJSON()
      } else if (params.type == "SELECTION" && params.validationValues.length > 0) {
         const channelRemark = ChannelRemark.build({
            name: params.name,
            desc: params.desc,
            channel: params.channel,
            type: params.type,
            validationValues: params.validationValues,
            isRequired: params.isRequired,
            isEnable: params.isEnable
         })
         const created = await channelRemark.save();
         return created.toJSON()
      } else if (params.type === "SELECTION" && params.validationValues.length === 0) {
         throw new BadRequestException("Option must not be empty for selection type");
      }
      else {
         throw new BadRequestException("This type not found");
      }



   }

   // async createSelectionRemark(params){
   //    const channelRemarkFieldType = params.type
   //    const addChannelRemarkFieldType = {

   //    }
   // }

   // async updateSelectionRemark(){

   // }

   async update(params) {
      const channelId = params.id
      if (params.type == "TEXT") {
         const newUpdate = {
            name: params.name,
            desc: params.desc,
            channel: params.channel,
            type: params.type,
            validationValues: params.validationValues,
            isRequired: params.isRequired,
            isEnable: params.isEnable
         }
         const updated = await ChannelRemark.findByIdAndUpdate(channelId, newUpdate, { new: true });
         return updated;
      } else if (params.type == "SELECTION") {
         if (params.type == "SELECTION" && params.validationValues.length > 0) {
            const newUpdate = {
               name: params.name,
               desc: params.desc,
               channel: params.channel,
               type: params.type,
               validationValues: params.validationValues,
               isRequired: params.isRequired,
               isEnable: params.isEnable
            }
            const updated = await ChannelRemark.findByIdAndUpdate(channelId, newUpdate, { new: true });
            return updated;
         } else if (params.type == "SELECTION" && params.validationValues.length <= 0) {
            throw new BadRequestException("Option must not be empty for SELECTION type");
         }
      } else {
         throw new BadRequestException("This type not found");
      }

   }

   async delete(params) {
      const channelRemarkId = params.id
      const deleted = ChannelRemark.findByIdAndDelete(channelRemarkId);
      return deleted;
   }

   async findAll() {
      const channelRemark = await ChannelRemark.find();
      return transformArrToJson(channelRemark)
   }

   async findById(channelRemarkId: string) {
      const channelRemark = await ChannelRemark.findById(channelRemarkId).populate('channel');
      return channelRemark.toJSON()
   }

   async findByIds(channelRemarkIds: string[]) {
      const channelRemarks = await ChannelRemark.find({ _id: { "$in": channelRemarkIds } }).populate('channel');
      return transformArrToJson(channelRemarks)
   }

   async findByChannel(channelId: string) {
      const channelRemark = await ChannelRemark.find({ channel: channelId}).populate('channel');
      if (!channelRemark) throw new BadRequestException("Channel remark is not found");
      return transformArrToJson(channelRemark);
   }

   async updateStatus(params) {
      const remarkId = params.id
      const newUpdate = {
         isRequired: params.isRequired,
      }
      const updated = ChannelRemark.findByIdAndUpdate(remarkId, newUpdate, { new: true });
      return updated;
   }

   async updateStatusEnable(params) {
      const remarkId = params.id
      const newUpdate = {
         isEnable: params.isEnable,
      }
      const updated = ChannelRemark.findByIdAndUpdate(remarkId, newUpdate, { new: true });
      return updated;
   }

   async updateStatusDeleted(params) {
      const remarkId = params.id
      const newUpdate = {
         deleted: params.deleted,
      }
      const updated = ChannelRemark.findByIdAndUpdate(remarkId, newUpdate, { new: true });
      return updated;
   }

   async setChannelRemarkFields(params: SetChFollowerRemarkFieldsInput) {
      const { remarkFields, follower, channel } = params;

      const remarkIds = remarkFields.map((rf: ChFollowerRemarkFieldInput) => rf.remark);
      const remarks = await this.findByIds(remarkIds);
      const chRemarks = await this.findByChannel(channel);

      if (chRemarks.length != remarks.length) throw new BadRequestException("The remark field input may be incorrect");
      await this.followerRemarkFieldService.set(params);
      const results = await this.findChannelRemarks({ channel, follower });
      return results;
   }

   async findChannelRemarks({ channel, follower }) {
      const results = await ChannelRemark.aggregate(
         [
            {
               $match: {
                  $expr: {
                     $and: [
                        {$eq: ["$channel", mongoose.Types.ObjectId(channel)]},
                        { $eq: ["$isEnable", true]}
                     ]
                     
                  }
               }
            },
            {
               $lookup: {
                  from: "followerremarkfields",
                  let: { remark_id: "$_id", channel_id: "$channel" },
                  as: "followerRemarkField",
                  pipeline: [{
                     $match: {
                        $expr: {
                           $and: [
                              { $eq: ["$remark", "$$remark_id"] },
                              { $eq: ["$channel", "$$channel_id"] },
                              { $eq: ["$user", mongoose.Types.ObjectId(follower)] }
                           ]
                        },

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
            {
               $project: {
                  _id: "$_id",
                  id: "$_id",
                  name: 1,
                  desc: 1,
                  channel: 1,
                  validationValues: 1,
                  type: 1,
                  followerRemarkField: 1,
                  isRequired: 1,
                  isEnable: 1,
               }
            }
         ]
      );

      return results;
   }
}