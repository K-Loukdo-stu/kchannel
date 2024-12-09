import { BadRequestException, Injectable } from "@nestjs/common";
import { transformArrToJson } from "src/utils";
import { FollowerRemarkField, FollowerRemarkFieldAttrs } from "./models/follower-remark-field.model";
import { ChFollowerRemarkFieldInput, ChFollowerRemarkFieldsInput, SetChFollowerRemarkFieldsInput } from "./type-defs/channel-remark";

@Injectable()
export class FollowerRemarkFieldService {
  async set(params: SetChFollowerRemarkFieldsInput): Promise<any> {
    const { remarkFields, follower, channel } = params;

    try {
      // Remove all previous values
      await FollowerRemarkField.deleteMany({ channel, user: follower });
      // Insert all new/updated values
      const addingRemarkFields: FollowerRemarkFieldAttrs[] = remarkFields.map((rm: ChFollowerRemarkFieldInput) => {
        return {
          value: rm.value,
          remark: rm.remark,
          user: follower,
          channel,
        } as FollowerRemarkFieldAttrs;
      });

      await FollowerRemarkField.insertMany(addingRemarkFields);

      const founds = await FollowerRemarkField.find({ user: follower, channel }).populate(["user", "channel", "remark"]);
      return transformArrToJson(founds);
    } catch (error) {
      throw new BadRequestException("Operation failed to update follower's remarks");
    }
  }

  async findByFollowerAndChannel(userId, params: ChFollowerRemarkFieldsInput) {
    const founds = await FollowerRemarkField.find({ user: params.follower, channel: params.channel }).populate(["user", "channel", "remark"]);
    return transformArrToJson(founds);
  }
}